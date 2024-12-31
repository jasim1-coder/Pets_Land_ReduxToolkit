import React, { useState,useEffect } from 'react'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import "./PieChart.css"
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
import { useDispatch,useSelector } from 'react-redux';
import { fetchProducts } from '../../../Redux/Admin/AdminSlice';


function PieChart() {
  const dispatch = useDispatch()
  const {products} = useSelector((state) => state.admin)
  const [categoryCounts, setCategoryCounts] = useState({ dog: 0, cat: 0 });
  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])

  const calculateCategoryCounts = () => {
            const counts = products.reduce((acc, product) => {
              if (product.category === 'dog') {
                acc.dog += 1;
              } else if (product.category === 'cat') {
                acc.cat += 1;
              }
              return acc;
            }, { dog: 0, cat: 0 });
            setCategoryCounts(counts); 
          };

          useEffect(() => {
            if (products.length > 0) {
              calculateCategoryCounts();
            }
          }, [products]); 

          const pieChartData = {
            labels: ['Dog', 'Cat'], 
            datasets: [
              {
                data: [categoryCounts.dog, categoryCounts.cat], 
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
              },
            ],
          };
  const pieChartOptions = {
    responsive: true,
    animation: {
      duration: 10, 
      easing: 'easeOutBounce', 
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
    
  return (
    <div className="pie-chart-container" style={{ width: '60%', height: '600px' }}>
    <h2>Product Categories Distribution</h2>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}><Pie data={pieChartData} options={pieChartOptions}/></div> </div>  )
}

export default PieChart