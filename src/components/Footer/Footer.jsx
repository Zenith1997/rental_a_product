import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import playstoreImg from '../../assets/images/playstoreImg.png';
import applestoreImg from '../../assets/images/applestoreImg.png';

const Footer = () => {
    return (
        <footer className="bg-gray-100 bottom-0 w-full static py-10 text-[#00000099]">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* DROODA Info Section */}
                <div>
                    <h1 className="text-2xl font-bold font-logoFont text-[#00000099]">DROODA</h1>
                    <p className="mt-4 text-sm leading-relaxed">
                        Gorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Etiam eu turpis molestie, dictum est a, mattis tellus.
                        Sed dignissim, metus nec fringilla accumsan, risus sem
                        sollicitudin lacus, ut interdum t.
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                            <CallIcon className="mr-2" />
                            <span>+961 1234 5678</span>
                        </div>
                        <div className="flex items-center">
                            <EmailIcon className="mr-2" />
                            <span>hello@drooda.com</span>
                        </div>
                        <div className="flex items-center">
                            <ChatBubbleIcon className="mr-2" />
                            <span>chat with support</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div>
                    <h2 className="text-lg font-semibold text-[#00000099]">Quick links</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>Home</li>
                        <li>Browse Rentals</li>
                        <li>My Account</li>
                        <li>FAQ</li>
                        <li>Contact Us</li>
                    </ul>
                </div>

                {/* Customer Support Section */}
                <div>
                    <h2 className="text-lg font-semibold text-[#00000099]">Customer Support</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li>Help Center</li>
                        <li>Return Policy</li>
                        <li>Terms & Conditions</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* Download the App Section */}
                <div>
                    <h2 className="text-lg font-semibold text-[#00000099]">Download the App</h2>
                    <div className="mt-4 flex flex-col">
                        <img src={playstoreImg} alt="Download from Google Play" className="w-32 mb-4" />
                        <img src={applestoreImg} alt="Download from App Store" className="w-32" />
                    </div>
                </div>
            </div>
            <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
                Copyright ©. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
