import Layout from '../../components/Layout';
import AnalyticsPage from '../../pages/AnalyticsPage/AnalyticsPage';

const AnalyticsPageM = () => {
  return (
    <>    <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
    <SearchBar/>
  </div><Layout>
    <Layout>
      <AnalyticsPage />
    </Layout>
    </>
  );
};

export default AnalyticsPageM;
