import { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import { Select, Table } from 'antd'

import { ReactComponent as NpmIcon } from '../../assets/npm.svg'
import { ReactComponent as GithubIcon } from '../../assets/github.svg'
import { getRankTypes, getRankData } from '../../services/index'

import './index.scss'

function Home() {
  const [rankTypes, setRankTypes] = useState([])
  const [currentRankType, setCurrentRankType] = useState('')
  const [rankedPackages, setRankedPackages] = useState([])
  const [chart, setChart] = useState<any>(undefined)

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      dataIndex: 'rank',
      width: 60
    },
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name'
    },
    // {
    //   title: '地址',
    //   key: 'urls',
    //   dataIndex: 'urls',
    //   width: 180,
    //   render: (text: any, item: any) => {
    //     return (

    //     )
    //   }
    // },
    // {
    //   title: 'Downloads',
    //   key: 'name',
    //   dataIndex: 'name'
    // },
    // {
    //   title: 'Version',
    //   key: 'version',
    //   dataIndex: 'version'
    // },
    {
      title: 'Updated',
      key: 'last_publish',
      dataIndex: 'last_publish',
    },
    // {
    //   title: 'Created',
    //   key: 'last_publish',
    //   dataIndex: 'last_publish',
    // },
  ]

  // echarts默认配色
  const PACKAGE_COLORS = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#F05E1C', '#B17844', '#D9CD90', '#86C166','#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#F05E1C', '#B17844', '#D9CD90', '#86C166', ]

  useEffect(() => {
    const onResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [chart])

  useEffect(() => {
    onGetRankTypes()
  }, [])

  useEffect(() => {
    if (rankedPackages.length) {
      onRenderChart(rankedPackages)
    }
  }, [rankedPackages])

  useEffect(() => {
    if (currentRankType) {
      onGetRankData(currentRankType)
    }
  }, [currentRankType])

  const onGetRankTypes = async () => {
    const result = await getRankTypes()
    setRankTypes(result.data)
    setCurrentRankType(result.data[0].label)
  }

  const onGetRankData = async (rankType: string) => {
    const result = await getRankData({
      params: {
        type: rankType
      }
    })
    let data = result.data.map((item: any, index: number) => {
      return {
        ...item,
        rank: index + 1
      }
    })
    setRankedPackages(data)
  }

  const onRenderChart = (data: any) => {
    var myChart = echarts.init((document as any).querySelector('#container'));
    data = data.reverse()
    let rankType = (rankTypes as any).find((item: any) => item.label === currentRankType)?.value
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: false,
      grid: {
        left: 0,
        right:  '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        data: data.map((item: any) => item.name)
      },
      series: [
        {
          name: 'last week',
          type: 'bar',
          itemStyle: {
            color: function (param: any, index: any) {
              return PACKAGE_COLORS[param.dataIndex] || '#5470c6';
            }
          },
          data: data.map((item: any) => item[rankType])
        }
      ]
    };
    myChart.setOption(option)
    setChart(myChart)
  }

  return (
    <div className='nrv'>
      <section className='nrv-header'>
        <a className='nrv-header-left' href='/'>
          <span className='nrv-header-npm'>
            <NpmIcon />
          </span>
        </a>
        <a className='nrv-header-right' href='https://github.com/XueMeijing/npmrank' target={'_blank'}>
          <span className='nrv-header-github'>
            <GithubIcon />
          </span>
        </a>
      </section>

      <section className='nrv-desc'>
        <h3>Npm package downloads ranking</h3>
      </section>

      <section className='nrv-chart'>
        <div>
          <span>Downloads ranking in </span>
          <Select
            value={currentRankType}
            onChange={(value, item: any) => {
              setCurrentRankType(item.label)
            }}
            options={rankTypes}
            style={{width: 150}}
          />
        </div>
        <div id='container' style={{height: 600}}></div>
      </section>

      <section className='nrv-table'>
        <h3>More Info</h3>
        <Table
          columns={columns}
          dataSource={rankedPackages}
          pagination={false}
          size={'small'}
        />
      </section>

      <section className='nrv-footer'>
        <div className='nrv-footer-about'>
          <h3>Datasource</h3>
          <p>
            
          </p>
        </div>

        <div className='nrv-footer-about'>
          <h3>About</h3>
          <p>
            This project start from my first seen <a href='http://'>glob</a>, holy shit which downloads 80175979 times per week!
            At the same time react have only 15661554 times. Is glob the NO.1? So i googled and found [anvaka](https://gist.github.com/anvaka/8e8fa57c7ee1350e3491) great work
            at 2019. He crawled all packages and statistics out top 1000 package. I just update their latest downloads and ranking. So there must some missing packages, if you find some missing packages or any other questions, It will be very grateful
            to open an issue.
          </p>
        </div>

        <div className='nrv-footer-more'>
          <h3>More</h3>
          <p>
            <a href='https://npmtrends.com/' target={'_blank'}>Compare package download counts over time</a>
          </p>
          <p>
            <a href='https://npm-stat.com/' target={'_blank'}>Generate download charts for any package on npm.</a>
          </p>
        </div>

        <div className='nrv-footer-copyright'>
          <span>&copy; 2023 – {new Date().getFullYear()}</span>
          <a href='https://github.com/XueMeijing'> XueMeijing</a>
        </div>
      </section>
    </div>
  )
}

export default Home