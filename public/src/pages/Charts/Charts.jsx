import { useEffect } from 'react'
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom"
import './Charts.modules.css' // Asegúrate de importar tu hoja de estilos si es necesario

const Charts = () => {
  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-proyecto1-motby", //Actualizar a proyecto1
    })

    const chart1 = sdk.createChart({
        chartId: "65e2614b-2540-46e1-8cc7-2d549be2a227", // REPLACE with the Chart ID
        height: "600px",
        width: "900px",
        // Additional options go here
    })

    const chart2 = sdk.createChart({
        chartId: "65e26338-865d-46c2-8f66-dc01b6f68828", // REPLACE with the Chart ID
        height: "600px",
        width: "900px",
        // Additional options go here
    })

    const chart3 = sdk.createChart({
      chartId: "65e26446-28ca-40db-8d12-93713c344c74", // REPLACE with the Chart ID
      height: "600px",
      width: "900px",
      // Additional options go here
  })


    chart1.render(document.getElementById("chart1"))
    chart2.render(document.getElementById("chart2"))
    chart3.render(document.getElementById("chart3"))

    
  }, [])

  return (
    <div className="charts-container">
      <div className="chart" id='chart1'></div>
      <div className="midChart"  id='chart2'></div>
      <div className="lastChart"  id='chart3'></div>
    </div>
  )
}

export default Charts