import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      debugger;
      const updatedCart = [...cart];
      const productOnCart = updatedCart.find(product => product.id  === productId);
      const avaliableStock = (await api.get(`stock/${productId}`)).data.amount;
      const currentAmount = productOnCart ? productOnCart.amount + 1 : 1;

      if (currentAmount > avaliableStock) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      
      if (productOnCart) {
        productOnCart.amount = currentAmount;
      }
      else {
        const fetchedProduct = (await api.get(`products/${productId}`)).data;
        updatedCart.push({
          ...fetchedProduct,
          amount: 1
        })
      }

      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      console.log('hook removing', productId, 'from cart');
      // TODO
    } catch  (e) {
      console.log(e);
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
