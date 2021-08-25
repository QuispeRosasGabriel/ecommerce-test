import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../components/Button";
import TableProducts from "../components/TableProducts";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  ICheckout,
  IProduct,
  ISelectedProduct,
  ISelectOption,
} from "../interfaces";
import { getProducts } from "../services/productService";
import { AxiosParams } from "../utils/axiosRequest";

const ORDER_KEYS = {
  NAME: "NAME",
  CATEGORY: "CATEGORY",
  PRICE: "PRICE",
};

const HIDE_KEYS = {
  YES: "YES",
  NO: "NO",
};

const Products = () => {
  const history = useHistory();
  const { setItem } = useLocalStorage();

  const [categories, setCategories] = useState<ISelectOption[]>([]);
  const [productsList, setProductsList] = useState<Array<IProduct>>([]);
  const [renderedProducts, setRenderedProducts] = useState<Array<IProduct>>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("None");
  const [selectedHideOption, setSelectedHideOption] = useState<string>(
    HIDE_KEYS.NO
  );
  const [selectedOrderOption, setSelectedOrderOption] = useState<string>(
    ORDER_KEYS.NAME
  );
  const [selectedProducts, setSelectedProducts] = useState<
    Array<ISelectedProduct>
  >([]);

  const params: AxiosParams = {
    url: "https://us-central1-fir-projects-3ee1f.cloudfunctions.net/demopayload",
    method: "GET",
    data: null,
    headers: null,
  };

  useEffect(() => {
    getProducts(params).then((products: IProduct[]) => {
      const realProducts = products.map((product, index) => ({
        ...product,
        id: index + 1,
      }));
      const sortedProductsByName = realProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setProductsList(sortedProductsByName);
      setRenderedProducts(sortedProductsByName);

      const categories: ISelectOption[] = realProducts
        .map((p) => p.category)
        .filter((category, i, array) => array.indexOf(category) === i)
        .map((c) => ({ value: c, text: c }));

      setCategories([{ text: "None", value: "None" }, ...categories]);
    });
  }, []);

  const orderProducts = (orderKey: string) => {
    if (orderKey === ORDER_KEYS.NAME) {
      setRenderedProducts((currentRenderedProducts) =>
        currentRenderedProducts.sort((a, b) => a.name.localeCompare(b.name))
      );
    }

    if (orderKey === ORDER_KEYS.CATEGORY) {
      setRenderedProducts((currentRenderedProducts) =>
        currentRenderedProducts.sort((a, b) =>
          a.category.localeCompare(b.category)
        )
      );
    }

    if (orderKey === ORDER_KEYS.PRICE) {
      setRenderedProducts((currentRenderedProducts) =>
        currentRenderedProducts.sort((a, b) => a.price - b.price)
      );
    }
  };

  const onCategorySelectChange = (value: string) => {
    if (selectedCategory === "None") {
      setSelectedCategory(value);
      setRenderedProducts((currentProducts) =>
        currentProducts.filter((p) => p.category === value)
      );
      return;
    }

    const newProducts = [...productsList];

    setSelectedCategory(value);
    setRenderedProducts(
      value === "None"
        ? newProducts
        : newProducts.filter((p) => p.category === value)
    );
    orderProducts(selectedOrderOption);
  };

  const onCheckout = () => {
    const products = selectedProducts.map((p) => ({
      ...p,
      total: Math.round(p.price * p.quantity * 100) / 100,
    }));

    let total: number = 0.0;

    products.forEach((p) => {
      total += p.total;
    });

    const checkout: ICheckout = {
      products,
      total,
    };

    setItem("checkout-data", JSON.stringify(checkout));
    history.push("/checkout");
  };

  const onOrderRadioButtonChange = (orderKey: string) => {
    setSelectedOrderOption(orderKey);
    orderProducts(orderKey);
  };

  const onSearchInputChange = (text: string) => {
    if (search.length < text.length) {
      setSearch(text);

      setRenderedProducts((products) =>
        products.filter((p) => p.name.includes(search))
      );

      return;
    }

    const newProducts = [...productsList];

    setSearch(text);
    setRenderedProducts(
      text === ""
        ? newProducts
        : newProducts.filter((p) => p.name.includes(text))
    );
    orderProducts(selectedOrderOption);
  };

  const onSelectProduct = (product: IProduct) => {
    setSelectedProducts((p) => [
      ...p,
      {
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);
  };

  const onSelectedProductQuantityChange = (
    productId: number,
    quantity: number
  ) => {
    const productIndex = selectedProducts.findIndex((p) => p.id === productId);
    const newSelectedProducts = [...selectedProducts];

    const productStock = renderedProducts.find(
      (p) => p.id === productId
    )?.stock;

    if (productStock && quantity > productStock) return;

    newSelectedProducts[productIndex].quantity = quantity;

    setSelectedProducts(newSelectedProducts);
  };

  const onUnSelectedProduct = (productId: number) => {
    setSelectedProducts((p) => p.filter((sp) => sp.id !== productId));
  };

  return (
    <>
      <div style={{ display: "flex", padding: 16 }}>
        <div style={{ padding: 4 }}>
          <label>
            <strong>Order by</strong>
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <div>
              <input
                type="radio"
                name="product-order"
                value={ORDER_KEYS.NAME}
                checked={selectedOrderOption === ORDER_KEYS.NAME}
                onChange={(e) => onOrderRadioButtonChange(e.target.value)}
              />{" "}
              Name
            </div>
            <div>
              <input
                type="radio"
                name="product-order"
                value={ORDER_KEYS.CATEGORY}
                checked={selectedOrderOption === ORDER_KEYS.CATEGORY}
                onChange={(e) => onOrderRadioButtonChange(e.target.value)}
              />{" "}
              Category
            </div>
            <div>
              <input
                type="radio"
                name="product-order"
                value={ORDER_KEYS.PRICE}
                checked={selectedOrderOption === ORDER_KEYS.PRICE}
                onChange={(e) => onOrderRadioButtonChange(e.target.value)}
              />{" "}
              Price
            </div>
          </div>
        </div>
        <div style={{ padding: 4 }}>
          <label>
            <strong>Hide out of stock</strong>
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <div>
              <input
                type="radio"
                name="hide-product-out-of-stock"
                value={HIDE_KEYS.YES}
                checked={selectedHideOption === HIDE_KEYS.YES}
                onChange={(e) => setSelectedHideOption(e.target.value)}
              />{" "}
              Yes
            </div>
            <div>
              <input
                type="radio"
                name="hide-product-out-of-stock"
                value={HIDE_KEYS.NO}
                checked={selectedHideOption === HIDE_KEYS.NO}
                onChange={(e) => setSelectedHideOption(e.target.value)}
              />{" "}
              No
            </div>
          </div>
        </div>
        <div style={{ padding: 4 }}>
          <label>
            <strong>Filter by category</strong>
          </label>
          <div style={{ display: "flex", justifyContent: "start" }}>
            <select
              value={selectedCategory}
              onChange={(e) => onCategorySelectChange(e.target.value)}
            >
              {categories.map((c, i) => (
                <option key={i} value={c.value}>
                  {c.text}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ padding: 4 }}>
          <label>
            <strong>Search by name</strong>
          </label>
          <div style={{ display: "flex", justifyContent: "start" }}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => onSearchInputChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <TableProducts
        hideProductsOutOfStock={selectedHideOption === HIDE_KEYS.YES}
        productsList={renderedProducts}
        selectedProducts={selectedProducts}
        selectProduct={onSelectProduct}
        unSelectedProduct={onUnSelectedProduct}
        updateSelectedProductQuantity={onSelectedProductQuantityChange}
      />
      <Button
        content="save"
        disabled={!(selectedProducts.length > 0)}
        variant="primary"
        type="submit"
        onClick={onCheckout}
      />
    </>
  );
};

export default Products;
