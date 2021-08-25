import React, { FC, useEffect, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import { ICheckout, ISelectedProduct } from "../interfaces";

export const Checkout: FC = () => {
  const { getItem } = useLocalStorage();

  const [checkout, setCheckout] = useState<ICheckout | null>(null);

  useEffect(() => {
    setCheckout(JSON.parse(getItem("checkout-data")!));
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Item</th>
            <th scope="col">Price/unit</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {checkout?.products.map((product) => (
            <tr key={product.id}>
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
              <td>${product.price}</td>
              <td>{product.quantity}</td>
              <td>${product.total}</td>
            </tr>
          ))}
          <tr>
            <td>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td>{Math.round(checkout?.total! * 100) / 100}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
