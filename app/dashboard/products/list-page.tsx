"use client";

import React, { useEffect, useState } from "react";
import { ProductProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import ProductInfo from "@/app/components/ProductInfo";
import Pagination from "@/app/components/Pagination";

type Props = {
  products: ProductProps[] | null;
  total: number;
  limit: number;
};

const List = ({ products, total, limit }: Props) => {
  const { dashboardProducts, fetchDashboardProducts, updateDashboardProducts } =
    useStore();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    updateDashboardProducts(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    updateDashboardProducts(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    updateDashboardProducts(page + 1);
  };

  useEffect(() => {
    if (products) {
      fetchDashboardProducts(products);
    }
  }, [fetchDashboardProducts, products]);

  return (
    <div className="contents-container">
      <CardList title={"Product List"}>
        {dashboardProducts &&
          dashboardProducts.map((item: ProductProps) => {
            return <ProductInfo key={item.productId} product={item} />;
          })}
      </CardList>
      <Pagination
        total={total}
        limit={limit}
        currentPage={page}
        onClickPage={handleClickPage}
        onClickPrev={handleClickPrevButton}
        onClickNext={handleClickNextButton}
      />
    </div>
  );
};

export default List;
