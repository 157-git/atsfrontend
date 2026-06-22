import logo from "../../../public/logo.jpeg";

function CompanyInfoHeader() {
    return (
        <div className="bg-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    
                    <img
                        src={logo}
                        alt="157 Industries Logo"
                        className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                    />

                    <div className="text-center sm:text-left">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            157 Industries Pvt Ltd
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            157 Careers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyInfoHeader;