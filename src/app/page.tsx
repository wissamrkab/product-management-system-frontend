"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import {Product} from "@/interfaces/product";
import {CategoryWithProductCount, transformCategoriesToTreeNodes} from "@/interfaces/category";
import {CategoryService} from "@/services/categoriesService";
import {useAppContext} from "@/contexts/appContext";
import {Chart} from "primereact/chart";

export default function Home() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const categoryService = new CategoryService();
  const { showToast } = useAppContext();

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesData = await categoryService.fetchCategoriesWithCount();

      if(categoriesData != undefined) {
        const data = {
          labels: categoriesData.map(value => value.name),
          datasets: [
            {
              data: categoriesData.map(value => value.count),
            }
          ]
        }
        const options = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true
              }
            }
          }
        };
        setChartData(data);
        setChartOptions(options);
      }
      else{
        showToast("error", "Categories Could Not Be Fetched");
      }
    };

    fetchCategoriesData();
  }, []);

  return (
      <div className=" p-5">
        <div className="card shadow-2 flex justify-content-center col-4">
          <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem"/>
        </div>
      </div>
  );
}
