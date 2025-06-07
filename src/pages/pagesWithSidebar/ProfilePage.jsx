import SearchBar from '../../components/Header/SearchBar'
import Layout from '../../components/Layout'
import ProfilePage from "../../pages/Profile/ProfilePage" 
const ProfilePageM = () => {
  return (
    <>    <div className='bg-white mt-5 flex justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]'>
    <SearchBar/>
  </div>
    <div>
      
      <Layout>
        <ProfilePage/>
      </Layout>
    </div>
    </>
  )
}

export default ProfilePageM
