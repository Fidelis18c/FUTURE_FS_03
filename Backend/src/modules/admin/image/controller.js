const crypto = require('crypto');
const supabase = require('../../../config/supabase');

const IMAGE_BUCKET = 'product-images';

const uploadImage = async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided (field name: image)' });

  try {
    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const path = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    res.status(201).json({ url: data.publicUrl });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImage };
