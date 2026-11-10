import { Router } from 'express';
import redis from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { requireStaff } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const ids = await redis.smembers('menu:index');
    if (!ids.length) return res.json([]);
    const items = await Promise.all(
      ids.map(async (id) => {
        const raw = await redis.get(`menu:${id}`);
        return raw ? JSON.parse(raw) : null;
      })
    );
    res.json(items.filter(Boolean));
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const raw = await redis.get(`menu:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: 'Menu item not found' });
    res.json(JSON.parse(raw));
  } catch (e) { next(e); }
});

router.post('/', requireStaff, async (req, res, next) => {
  try {
    const { name, description = '', category = 'other', price, available = true } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'price must be a positive number' });
    }
    const id = uuidv4();
    const item = { id, name: name.trim(), description, category, price, available: !!available };
    await redis.set(`menu:${id}`, JSON.stringify(item));
    await redis.sadd('menu:index', id);
    res.status(201).json(item);
  } catch (e) { next(e); }
});

router.put('/:id', requireStaff, async (req, res, next) => {
  try {
    const raw = await redis.get(`menu:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: 'Menu item not found' });
    const existing = JSON.parse(raw);
    const { name, description, category, price, available } = req.body;

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price <= 0)) {
      return res.status(400).json({ error: 'price must be a positive number' });
    }

    const updated = {
      ...existing,
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price }),
      ...(available !== undefined && { available: !!available }),
    };
    await redis.set(`menu:${req.params.id}`, JSON.stringify(updated));
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', requireStaff, async (req, res, next) => {
  try {
    const raw = await redis.get(`menu:${req.params.id}`);
    if (!raw) return res.status(404).json({ error: 'Menu item not found' });
    await redis.del(`menu:${req.params.id}`);
    await redis.srem('menu:index', req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (e) { next(e); }
});

export default router;