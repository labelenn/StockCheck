import type { Category } from '../types';

/**
 * Hard-coded household essentials, grouped by category.
 * Edit freely — add/remove/rename categories or items. Item identity for
 * persistence is derived from `categoryId + item name` (see makeItemKey in
 * src/types.ts), so renaming an item will reset its checked state, but
 * reordering items/categories will not.
 */
export const categories: Category[] = [
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: '🛁',
    items: [
      'Toilet paper',
      'Hand soap',
      'Bath towels',
      'Shower gel',
      'Toothpaste',
      'Toothbrush heads',
      'Dental floss',
      'Cotton buds',
    ],
  },
  {
    id: 'laundry',
    name: 'Laundry',
    icon: '🧺',
    items: [
      'Laundry detergent',
      'Fabric softener',
      'Stain remover',
      'Dryer sheets',
      'Washing machine cleaner',
      'Clothes pegs',
    ],
  },
  {
    id: 'pantry',
    name: 'Pantry',
    icon: '🥫',
    items: [
      'Rice',
      'Pasta',
      'Olive oil',
      'Tinned tomatoes',
      'Flour',
      'Sugar',
      'Tea bags',
      'Coffee',
      'Breakfast cereal',
      'Tinned beans',
    ],
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: '🧊',
    items: ['Milk', 'Eggs', 'Butter', 'Cheese', 'Yoghurt', 'Fresh vegetables', 'Fresh fruit'],
  },
  {
    id: 'freezer',
    name: 'Freezer',
    icon: '❄️',
    items: ['Frozen peas', 'Frozen berries', 'Bread (spare loaf)', 'Ice cream', 'Frozen chicken'],
  },
  {
    id: 'household-cleaning',
    name: 'Household Cleaning',
    icon: '🧽',
    items: [
      'Dish soap',
      'Dishwasher tablets',
      'All-purpose cleaner',
      'Sponges',
      'Bin bags',
      'Paper towels',
      'Glass cleaner',
    ],
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    icon: '🧴',
    items: ['Shampoo', 'Conditioner', 'Deodorant', 'Razors', 'Shaving cream', 'Hand cream'],
  },
  {
    id: 'kitchen-supplies',
    name: 'Kitchen Supplies',
    icon: '🍽️',
    items: [
      'Cling film',
      'Aluminium foil',
      'Baking paper',
      'Zip-lock bags',
      'Sponges (kitchen)',
      'Kitchen roll',
    ],
  },
];
