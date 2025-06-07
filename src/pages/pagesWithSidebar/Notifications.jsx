import SearchBar from '../../components/Header/SearchBar';
import Layout from '../../components/Layout';
import NotificationPage from '../../pages/Notification/NotificationPage'

const NotificationPageM = () => {
  return (
    <>    <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
    <SearchBar/>
  </div>
    <Layout>
      <NotificationPage />
    </Layout></>
  );
};

export default NotificationPageM;
