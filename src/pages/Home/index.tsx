import { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Select, Table, Space } from 'antd';
import Icon, { GithubOutlined, HomeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import { RankingType, SelectRankingType, RankingPackage } from './types';
import { getRankingTypes, getRankingPackages } from '../../services/index';

import { ReactComponent as NpmIcon } from '../../assets/npm.svg';
import { ReactComponent as GithubIcon } from '../../assets/github.svg';
import { ReactComponent as LinkNpmIcon } from '../../assets/link-npm.svg';

import './index.scss';

function Home() {
  const [rankingTypes, setRankingTypes] = useState<SelectRankingType[]>([]);
  const [currentRankType, setCurrentRankType] = useState<RankingType>('');
  const [rankingPackages, setRankingPackages] = useState<RankingPackage[]>([]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [chart, setChart] = useState<any>(undefined);

  const columns: ColumnsType<RankingPackage> = [
    {
      title: 'Rank',
      key: 'rank',
      dataIndex: 'rank',
      width: 60,
    },
    {
      title: 'Package',
      key: 'id',
      dataIndex: 'id',
      width: 260,
    },
    {
      title: 'Links',
      key: 'Links',
      dataIndex: 'Links',
      width: 200,
      render: (text: undefined, item: RankingPackage) => {
        return (
          <Space>
            <a
              className="url-icon"
              href={item.npmUrl}
              target="_blank"
              style={{ fontSize: 30 }}
              rel="noreferrer"
            >
              <Icon component={LinkNpmIcon} />
            </a>
            {!!item.githubUrl && (
              <a className="url-icon" href={item.githubUrl} target="_blank" rel="noreferrer">
                <GithubOutlined />
              </a>
            )}
            {!!item.homepageUrl && (
              <a className="url-icon" href={item.homepageUrl} target="_blank" rel="noreferrer">
                <HomeOutlined />
              </a>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Downloads',
      key: 'downloads',
      dataIndex: 'downloads',
      width: 200,
      render: (text) => downloadsFormat(text),
      sorter: (a, b) => a.downloads - b.downloads,
    },
    {
      title: 'Stars',
      key: 'githubStar',
      dataIndex: 'githubStar',
      width: 100,
      sorter: (a, b) => {
        let totalA = a.githubStar.indexOf('k') > -1 ? (a.githubStar.split('k')[0] as any)*1000 : a.githubStar
        let totalB = b.githubStar.indexOf('k') > -1 ? (b.githubStar.split('k')[0] as any)*1000 : b.githubStar
        return Number(totalA) - Number(totalB)
      },
    },
    {
      title: 'License',
      key: 'license',
      dataIndex: 'license',
      width: 100,
      render: (text) => (text ? text : '-'),
    },
    {
      title: 'Version',
      key: 'version',
      dataIndex: 'version',
      width: 100,
    },
    {
      title: 'Updated',
      key: 'updated',
      dataIndex: 'updated',
      width: 200,
    },
    {
      title: 'Created',
      key: 'created',
      dataIndex: 'created',
      width: 200,
      sorter: (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    },
  ];

  // echarts默认配色
  const PACKAGE_COLORS = [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ];

  useEffect(() => {
    const onResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [chart]);

  useEffect(() => {
    onGetRankingTypes();
  }, []);

  useEffect(() => {
    if (currentRankType) {
      onGetRankingPackages(currentRankType);
    }
  }, [currentRankType]);

  useEffect(() => {
    if (rankingPackages.length) {
      onRenderChart(rankingPackages);
    }
  }, [rankingPackages]);

  const onGetRankingTypes = async () => {
    const result = await getRankingTypes();
    if (result.code === 200) {
      let tmpData = result.data;
      setRankingTypes(tmpData);
      if (!!tmpData[0]) {
        setCurrentRankType(tmpData[0]?.value);
      }
    }
  };

  const onGetRankingPackages = async (rankType: string) => {
    setSpinning(true);
    const result = await getRankingPackages({
      params: {
        type: rankType,
      },
    }).finally(() => {
      setSpinning(false);
    });
    setRankingPackages(result.data);
  };

  const onRenderChart = (data: RankingPackage[]) => {
    var myChart = echarts.init((document as any).querySelector('#container'));
    data = data.reverse();

    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: false,
      grid: {
        left: 0,
        top: 0,
        right: '3%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: data.map((item: RankingPackage) => item.id),
      },
      series: [
        {
          name: currentRankType,
          type: 'bar',
          itemStyle: {
            color: function (param: any) {
              return (
                PACKAGE_COLORS.concat(PACKAGE_COLORS).concat(PACKAGE_COLORS).concat(PACKAGE_COLORS)[
                  param.dataIndex
                ] || '#5470c6'
              );
            },
            barBorderRadius: [0, 18, 18, 0],
          },
          data: data.map((item: RankingPackage) => item.downloads),
        },
      ],
    };
    myChart.setOption(option);
    setChart(myChart);
  };

  const downloadsFormat = (downloads: number) => {
    let reg = '/\\d{1,3}(?=(\\d{3})+$)/g';
    return String(downloads).replace(eval(reg), function (s) {
      return s + ',';
    });
  };

  return (
    <div className="nrv">
      <section className="nrv-header">
        <a className="nrv-header-left" href="/">
          <span className="nrv-header-npm">
            <NpmIcon />
          </span>
        </a>
        <a
          className="nrv-header-right"
          href="https://github.com/XueMeijing/npmrank"
          target={'_blank'}
          rel="noreferrer"
        >
          <span className="nrv-header-github">
            <GithubIcon />
          </span>
        </a>
      </section>

      <section className="nrv-desc">
        <h3>Npm packages downloads ranking</h3>
      </section>

      <section className="nrv-chart">
        <div className="nrv-content-detail">
          <span>Downloads ranking in &emsp;</span>
          <Select
            value={currentRankType}
            onChange={setCurrentRankType}
            options={rankingTypes}
            style={{ width: 150 }}
          />
        </div>
        <h3>Chart</h3>
        <div id="container" style={{ height: 700 }}></div>
      </section>

      <section className="nrv-table">
        <h3>Table</h3>
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={rankingPackages}
          pagination={false}
          size={'small'}
          loading={spinning}
        />
      </section>

      <section className="nrv-footer">
        <div className="nrv-footer-about">
          <h3>Data Source</h3>
          <p className="nrv-content-detail">
            <span>All data comes directly from </span>
            <a
              href="https://github.com/npm/registry/blob/master/docs/download-counts.md"
              target={'_blank'}
              rel="noreferrer"
            >
              npm api
            </a>
            <span>, and will update at soon after UTC midnight, once per day.</span>
          </p>
        </div>

        <div className="nrv-footer-about">
          <h3>About</h3>
          <p className="nrv-content-detail">
            <span>This project comes from the first time I saw </span>
            <a href="https://www.npmjs.com/package/glob" target={'_blank'} rel="noreferrer">
              {' glob'}
            </a>
            <span>
              , holy shit which downloads 80175979 times per week! At the same time react had only
              15661554 times. Is glob the NO.1? So i googled and found
            </span>
            <a
              href="https://gist.github.com/anvaka/8e8fa57c7ee1350e3491"
              target={'_blank'}
              rel="noreferrer"
            >
              {' anvaka '}
            </a>
            <span>
              great work at 2019. He crawled all packages and statistics out top 1000 packages. I
              just update their latest downloads and ranking. So there must some missing packages,
              if you find some missing packages or any other questions, It will be very grateful to
              open an issue.
            </span>
          </p>
        </div>

        <div className="nrv-footer-more">
          <h3>More</h3>
          <p className="nrv-content-detail">
            <a href="https://npmtrends.com/" target={'_blank'} rel="noreferrer">
              Compare package download counts over time
            </a>
          </p>
          <p>
            <a href="https://npm-stat.com/" target={'_blank'} rel="noreferrer">
              Generate download charts for any package on npm.
            </a>
          </p>
        </div>

        <div className="nrv-footer-copyright">
          <span>&copy; 2023 – {new Date().getFullYear()}</span>
          <a href="https://github.com/XueMeijing"> XueMeijing</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
