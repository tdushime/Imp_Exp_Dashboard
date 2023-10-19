import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'

const Dashboard = () => {
  const [exportsData, setExportsData] = useState([])
  const [importsData, setImportsData] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    //const importsFilePath = '/imports.csv'
    const importsFilePath = './public/imports.csv'
    Papa.parse(importsFilePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setImportsData(result.data)
        setLoading(false)
      },
    })
    //const exportsFilePath = '/exports.csv'
    const exportsFilePath = '/Imp_Exp_Dashboard/public/exports.csv'
    Papa.parse(exportsFilePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        setExportsData(result.data)
        setLoading(false)
      },
    })
  }, [])
  const labels =
    exportsData && exportsData[0]
      ? Object.keys(exportsData[0]).filter((key) => /^\d{4}$/.test(key))
      : []
  console.log('exportsdata: ', exportsData)
  console.log('importsdata: ', importsData)
  console.log('II ', 'II22')
  const countries = [...new Set(exportsData.map((item) => item.country))].filter(Boolean)
  const customColorPalette = [
    '#0B5394',
    '#741B47',
    '#351C75',
    '#38761D',
    '#B45F06',
    '#990000',
    '#BF9000',
  ]
  const exportsDatasets = countries
    .filter((country) => country !== null)
    .map((country, index) => {
      const countryData = exportsData.filter((item) => item.country === country)
      const countryDataArray = labels.map((year) => countryData[0][year])
      return {
        label: country,
        data: countryDataArray,
        backgroundColor: customColorPalette[index % customColorPalette.length],
        borderColor: customColorPalette[index % customColorPalette.length],
        pointBorderColor: customColorPalette[index % customColorPalette.length],
        fill: false,
      }
    })
  const importsDatasets = countries
    .filter((country) => country !== null)
    .map((country, index) => {
      const countryData = importsData.filter((item) => item.country === country)
      const countryDataArray = labels.map((year) => countryData[0][year])
      return {
        label: country,
        data: countryDataArray,
        backgroundColor: customColorPalette[index % customColorPalette.length],
        borderColor: customColorPalette[index % customColorPalette.length],
        pointBorderColor: customColorPalette[index % customColorPalette.length],
        fill: false,
      }
    })
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        display: true,
        align: 'start',
        labels: {
          boxWidth: 20,
          fontSize: 14,
        },
      },
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            return formatYAxisTick(value)
          },
          // maxTicksLimit: 50,
          // stepSize: 100000000000,
          // max: 600000000000,
        },
      },
    },
    elements: {
      line: {
        tension: 0.0,
      },
      point: {
        radius: 2,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
  }
  const [activeLines, setActiveLines] = useState(countries.map((country) => country)) // Initialize all lines as active
  const importsChartData = {
    labels,
    datasets: importsDatasets.map((dataset) => ({ ...dataset, stacked: true })),
  }
  const exportsChartData = {
    labels,
    datasets: exportsDatasets,
  }
  const random = () => Math.round(Math.random() * 100)
  const hardData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [random(), random(), random(), random(), random(), random(), random()],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [random(), random(), random(), random(), random(), random(), random()],
      },
    ],
  }
  console.log('labels: ', labels)
  console.log('countries: ', countries)
  console.log('Imports chartData: ', importsChartData)
  console.log('Exports chartData: ', exportsChartData)
  console.log('hardData2: ', hardData)
  console.log('See data..: ', 'The Data')

  function formatYAxisTick(value) {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B'
    }
    return value
  }

  return (
    <CRow>
      {/* <CCol xs={12}>
        <DocsCallout
          name="Chart"
          href="components/chart"
          content="React wrapper component for Chart.js 3.0, the most popular charting library."
        />
      </CCol> */}
      <CCol xs={12}>
        <h1>Imports</h1>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar data={importsChartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine data={importsChartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <h1>Exports</h1>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar data={exportsChartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine data={exportsChartData} options={options} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Data1',
                    backgroundColor: '#g27979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                  {
                    label: 'Data2',
                    backgroundColor: '#f87978',
                    data: [30, 50, 18, 19, 30, 30, 39, 60, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Line Chart</CCardHeader>
          <CCardBody>
            <CChartLine
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [random(), random(), random(), random(), random(), random(), random()],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
