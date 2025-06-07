import SearchBar from '../../components/Header/SearchBar';
import Layout from '../../components/Layout';
import SettingPage from '../../pages/Settings/SettingPage';

const SettingPageM = () => {
  return (

    <>    <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
    <SearchBar/>
  </div>
    <Layout>
      <SettingPage />
    </Layout>
    </>
  );
};

export default SettingPageM;
