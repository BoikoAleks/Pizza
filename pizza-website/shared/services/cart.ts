import { axiosInstance } from './instance';
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';

// Робить запит GET /api/cart
export const getCart = async (): Promise<CartDTO> => {
  try {
    return (await axiosInstance.get<CartDTO>('/cart')).data;
  } catch (error) {
    console.error(error);
    throw error; // Прокидуємо помилку далі, щоб її можна було обробити в компоненті
  }
};

// Робить запит PATCH /api/cart/[id]
export const updateItemQuantity = async (itemId: number, quantity: number): Promise<CartDTO> => {
  try {
    return (await axiosInstance.patch<CartDTO>(`/cart/${itemId}`, { quantity })).data;
  } catch (error) {
    console.error(error);
    throw error; // Прокидуємо помилку далі, щоб її можна було обробити в компоненті
  }
};

// Робить запит DELETE /api/cart/[id]
export const removeCartItem = async (id: number): Promise<CartDTO> => {
  try {
    return (await axiosInstance.delete<CartDTO>(`/cart/${id}`)).data;
  } catch (error) {
    console.error(error);
    throw error; // Прокидуємо помилку далі, щоб її можна було обробити в компоненті
  }
};

// Робить запит POST /api/cart
export const addCartItem = async (values: CreateCartItemValues): Promise<CartDTO> => {
  try {
    return (await axiosInstance.post<CartDTO>('/cart', values)).data;
  } catch (error) {
    console.error(error);
    throw error; // Прокидуємо помилку далі, щоб її можна було обробити в компоненті
  }
};