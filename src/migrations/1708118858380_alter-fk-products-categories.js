exports.up = (pgm) => {
  pgm.alterColumn('products', 'category_id', {
    notNull: false,
  });

  pgm.dropConstraint('products', 'products_category_id_fkey');

  pgm.addConstraint('products', 'products_category_id_fkey', {
    foreignKeys: {
      columns: 'category_id',
      references: 'categories(id)',
      onDelete: 'SET NULL',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('products', 'products_category_id_fkey');
};
