const db = require('../../config/db');

// The frontend (ProductCard, ProductDetails) was originally built against
// static JSON product data shaped as { colors, storage, variantData }.
// Live products only carry a raw `variants` array, so derive the same shape
// here rather than duplicating this logic in multiple frontend components.
const shapeVariantSummary = (product) => {
  const variants = product.variants || [];
  const variantData = {};
  const colors = [];
  const storageSet = new Set();

  for (const v of variants) {
    const color = v.attributes?.color;
    const storage = v.attributes?.storage || '';
    if (!color) continue;

    if (!variantData[color]) {
      variantData[color] = { image: v.image_url || product.image || null, prices: {} };
      colors.push(color);
    }
    if (storage) storageSet.add(storage);
    variantData[color].prices[storage] = parseFloat(v.price);
  }

  return { ...product, colors, storage: [...storageSet], variantData };
};

const getAllProducts = async (req, res, next) => {
  // 1. Sanitize and validate pagination
  let limit = parseInt(req.query.limit) || 20;
  let offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;
  const search = req.query.search;
  const brand = req.query.brand;

  // Prevent abuse and invalid values
  if (limit > 100) limit = 100;
  if (limit < 1) limit = 20;
  if (offset < 0) offset = 0;

  try {
    let query = `
      SELECT p.id, p.name, p.slug, p.description, p.category_id, p.image_url as image, p.created_at, c.name as category_name,
      (SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = p.id) as price,
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', v.id,
            'name', v.name,
            'attributes', v.attributes,
            'price', v.price,
            'image_url', v.image_url,
            'available', COALESCE(i.available, 0)
          ))
          FROM product_variants v
          LEFT JOIN inventory i ON v.id = i.variant_id
          WHERE v.product_id = p.id
        ),
        '[]'::json
      ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND c.slug = $${params.length}`;
    }

    // There's no brand column — the storefront's sub-navigation (e.g.
    // "iPhone", "Samsung", "iPad") is matched against the product name.
    if (brand) {
      params.push(`%${brand}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    params.push(limit, offset);
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await db.query(query, params);
    res.json(result.rows.map(shapeVariantSummary));
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const query = `
      SELECT p.*, p.image_url as image, c.name as category_name,
      (SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = p.id) as price,
      (
        SELECT json_agg(json_build_object(
          'id', v.id,
          'name', v.name,
          'attributes', v.attributes,
          'price', v.price,
          'image_url', v.image_url,
          'available', i.available
        ))
        FROM product_variants v
        LEFT JOIN inventory i ON v.id = i.variant_id
        WHERE v.product_id = p.id
      ) as variants
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `;
    const result = await db.query(query, [slug]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(shapeVariantSummary(result.rows[0]));
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductBySlug };
