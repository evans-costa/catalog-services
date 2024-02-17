exports.up = (pgm) => {
  pgm.createTable('categories', {
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
    description: {
      type: 'text',
      notNull: true,
    },
    owner_id: {
      type: 'integer',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('categories');
};
