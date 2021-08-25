import React, { FC, Fragment } from "react";
import { IProduct, ISelectedProduct } from "../interfaces";

interface TableProductsProps {
  hideProductsOutOfStock: boolean;
  productsList: Array<IProduct>;
  selectProduct: (product: IProduct) => void;
  selectedProducts: ISelectedProduct[];
  unSelectedProduct: (productId: number) => void;
  updateSelectedProductQuantity: (productId: number, quantity: number) => void;
}

const TableProducts: FC<TableProductsProps> = ({
  hideProductsOutOfStock,
  productsList,
  selectProduct,
  selectedProducts,
  unSelectedProduct,
  updateSelectedProductQuantity,
}) => {
  const handleSelectedProduct = (product: IProduct, checked: boolean) => {
    console.log("Handle selected product");
    checked ? selectProduct(product) : unSelectedProduct(product.id);
  };

  const renderProductItem = (product: IProduct, index: number) => {
    const render =
      (hideProductsOutOfStock && product.stock > 0) || !hideProductsOutOfStock;

    if (render) {
      return (
        <tr key={index}>
          <td>
            <input
              type="checkbox"
              disabled={product.stock === 0}
              checked={selectedProducts.some((p) => p.id === product.id)}
              onChange={(e) => handleSelectedProduct(product, e.target.checked)}
            />
          </td>
          <td>
            <img
              src={product.image}
              alt={product.name}
              width="150"
              height="150"
              className="img-thumbnail"
            />
          </td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>${product.price}</td>
          <td>{product.stock}</td>
          <td>
            {selectedProducts.some((p) => p.id === product.id) && (
              <input
                type="number"
                min="1"
                value={
                  selectedProducts.find((p) => p.id === product.id)?.quantity
                }
                onChange={(e) =>
                  updateSelectedProductQuantity(
                    product.id,
                    parseInt(e.target.value)
                  )
                }
              />
            )}
          </td>
        </tr>
      );
    }

    return null;
  };

  return (
    <Fragment>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {productsList.map((product, idx) => renderProductItem(product, idx))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default TableProducts;
