import { Router } from 'express';
import redis from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireStaff } from '../middleware/auth.js';

const router = Router();
const STATUSES = ['Pending', 'Preparing', 'Ready', 'Collected'];

router.get('/', requireStaff, async (req, res, next) => {
  try {
    const ids = await redis.zrange('orders:index', 0, -1, 'REV');
    if (!ids.length) return res.json([]);
    const orders = await Promise.all(
      ids.map(async (id) => {
        const raw = await redis.get(`order:${id}`);
        return raw ? JSON.parse(raw) : null;
      })
    );
    res.json(orders.filter(Boolean));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const raw = await redis.get(`order:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: 'Order not found' });
    res.json(JSON.parse(raw));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { customerName, items, notes = '' } = req.body;

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return res.status(400).json({ error: 'customerName is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array' });
    }

    const lineItems = [];
    for (const entry of items) {
      const { menuItemId, qty } = entry;
      if (!menuItemId) return res.status(400).json({ error: 'each item needs menuItemId' });
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ error: 'qty must be a positive integer' });
      }
      const raw = await redis.get(`menu:${menuItemId}`);
      if (!raw) return res.status(400).json({ error: `menu item ${menuItemId} not found` });
      const menuItem = JSON.parse(raw);
      if (!menuItem.available) {
        return res.status(400).json({ error: `${menuItem.name} is not available` });
      }
      lineItems.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        qty,
        lineTotal: +(menuItem.price * qty).toFixed(2),
      });
    }

    const total = +lineItems.reduce((s, l) => s + l.lineTotal, 0).toFixed(2);
    const id = uuidv4();
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    
    const order = {
      id,
      orderNumber: `ORD-${stamp}-${rand}`,
      customerName: customerName.trim(),
      items: lineItems,
      total,
      status: 'Pending',
      notes,
      createdAt: new Date().toISOString(),
    };

    await redis.set(`order:${id}`, JSON.stringify(order));
    await redis.zadd('orders:index', Date.now(), id);
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.patch('/:id/status', requireStaff, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${STATUSES.join(', ')}` });
    }
    const raw = await redis.get(`order:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: 'Order not found' });
    const order = JSON.parse(raw);
    order.status = status;
    order.updatedAt = new Date().toISOString();
    await redis.set(`order:${req.params.id}`, JSON.stringify(order));
    res.json(order);
  } catch (e) { next(e); }
});

export default router;