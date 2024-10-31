// assets
import { ProductOutlined } from '@ant-design/icons';

// icons
const icons = {
    ProductOutlined
};

// ==============================|| MENU ITEMS - PRODUCTS ||============================== //

const products = {
  id: 'group-products',
  title: 'Productos',
  type: 'group',
  children: [
    {
      id: 'productos',
      title: 'Productos',
      type: 'item',
      url: '/products',
      icon: icons.ProductOutlined,
      breadcrumbs: false
    }
  ]
};

export default products;