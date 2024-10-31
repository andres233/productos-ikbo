// assets
import { ShoppingOutlined } from '@ant-design/icons';

// icons
const icons = {
    ShoppingOutlined
};

// ==============================|| MENU ITEMS - PRODUCTS ||============================== //

const orders = {
  id: 'group-orders',
  title: 'Ventas',
  type: 'group',
  children: [
    {
      id: 'ventas',
      title: 'Ventas',
      type: 'item',
      url: '/orders',
      icon: icons.ShoppingOutlined,
      breadcrumbs: false
    }
  ]
};

export default orders;