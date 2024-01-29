import { body } from 'express-validator';

export interface ProductForm {
  title: string;
  price: number;
  image: string;
}

export enum ProductFormKeys {
  title = 'title',
  price = 'price',
  image = 'image',
}

//
//
// Custom validators
export const productValidationChains = {
  requireCreateTitle: () =>
    body(ProductFormKeys.title)
      .trim()
      .isLength({ min: 4 })
      .withMessage('Title should be minimum 4 characters long'),

  requireCreatePrice: () =>
    body(ProductFormKeys.price)
      .trim()
      .toFloat()
      .isFloat({ min: 0.01 })
      .withMessage('Price should be more than 0'),

  requireCreateImage: () =>
    body(ProductFormKeys.image)
      .trim()
      .isLength({ min: 1 })
      .withMessage('Image is required'),
};
