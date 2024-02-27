import { useEffect } from 'react'
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom"
import './Charts.modules.css' // Asegúrate de importar tu hoja de estilos si es necesario

const Charts = () => {
  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-lab03-pulij", //Actualizar a proyecto1
    })

    const chart1 = sdk.createChart({
        chartId: "65cbbb79-744d-41a0-8a9d-15cb71214bd4", // REPLACE with the Chart ID
        height: "600px",
        width: "900px",
        // Additional options go here
    })

    const chart2 = sdk.createChart({
        chartId: "65cbc24c-5844-45ef-8698-f38daf84bf08", // REPLACE with the Chart ID
        height: "600px",
        width: "900px",
        // Additional options go here
    })


    chart1.render(document.getElementById("chart1"))
    chart2.render(document.getElementById("chart2"))

    
  }, [])

  return (
    <div className="charts-container">
      <div className="chart" id='chart1'></div>
      <div className="lastChart"  id='chart2'></div>
    </div>
  )
}

export default Charts