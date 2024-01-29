exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'uuid',
      default: pgm.func('gen_random_uuid()'),
      notNull: true,
      primaryKey: true,
    },

    title: {
      type: 'varchar(256)',
      notNull: true,
    },

    ownerId: {
      type: 'integer',
      notNull: true,
    },

    description: {
      type: 'text',
      notNull: true,
    },

    categoryId: {
      type: 'uuid',
      notNull: true,
      references: 'categories(id)',
    },

    price: {
      type: 'numeric(10,2)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('products');
};
