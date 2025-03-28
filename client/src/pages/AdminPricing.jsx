import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaEdit, FaTrash, FaPlus, FaPercentage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPricing = () => {
    const specialtiesList = [
        "Covid Treatment",
        "Sexual Health",
        "Eye Specialist",
        "Womens Health",
        "Diet & Nutrition",
        "Skin & Hair",
        "Bones and Joints",
        "Child Specialist",
        "Dental Care",
        "Heart",
        "Kidney Issues",
        "Cancer",
        "Ayurveda",
        "General Physician",
        "Mental Wellness",
        "Homoeopath",
        "General Surgery",
        "Urinary Issues",
        "Lungs and Breathing",
        "Physiotherapy",
        "Ear, Nose, Throat",
        "Brain and Nerves",
        "Diabetes Management",
        "Veterinary",
    ];

    const currencies = [
        { code: "USD", name: "US Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "AUD", name: "Australian Dollar" },
        { code: "CAD", name: "Canadian Dollar" },
        { code: "CHF", name: "Swiss Franc" },
        { code: "CNY", name: "Chinese Yuan" },
        { code: "SEK", name: "Swedish Krona" },
        { code: "NZD", name: "New Zealand Dollar" },
        { code: "MXN", name: "Mexican Peso" },
        { code: "SGD", name: "Singapore Dollar" },
        { code: "HKD", name: "Hong Kong Dollar" },
        { code: "NOK", name: "Norwegian Krone" },
        { code: "KRW", name: "South Korean Won" },
        { code: "TRY", name: "Turkish Lira" },
        { code: "RUB", name: "Russian Ruble" },
        { code: "INR", name: "Indian Rupee" },
        { code: "BRL", name: "Brazilian Real" },
        { code: "ZAR", name: "South African Rand" },
        { code: "AED", name: "UAE Dirham" },
        { code: "AFN", name: "Afghan Afghani" },
        { code: "ALL", name: "Albanian Lek" },
        { code: "AMD", name: "Armenian Dram" },
        { code: "ANG", name: "Netherlands Antillean Guilder" },
        { code: "AOA", name: "Angolan Kwanza" },
        { code: "ARS", name: "Argentine Peso" },
        { code: "AWG", name: "Aruban Florin" },
        { code: "AZN", name: "Azerbaijani Manat" },
        { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
        { code: "BBD", name: "Barbadian Dollar" },
        { code: "BDT", name: "Bangladeshi Taka" },
        { code: "BGN", name: "Bulgarian Lev" },
        { code: "BHD", name: "Bahraini Dinar" },
        { code: "BIF", name: "Burundian Franc" },
        { code: "BMD", name: "Bermudan Dollar" },
        { code: "BND", name: "Brunei Dollar" },
        { code: "BOB", name: "Bolivian Boliviano" },
        { code: "BSD", name: "Bahamian Dollar" },
        { code: "BTN", name: "Bhutanese Ngultrum" },
        { code: "BWP", name: "Botswanan Pula" },
        { code: "BYN", name: "Belarusian Ruble" },
        { code: "BZD", name: "Belize Dollar" },
        { code: "CDF", name: "Congolese Franc" },
        { code: "CLP", name: "Chilean Peso" },
        { code: "COP", name: "Colombian Peso" },
        { code: "CRC", name: "Costa Rican Colón" },
        { code: "CUP", name: "Cuban Peso" },
        { code: "CVE", name: "Cape Verdean Escudo" },
        { code: "CZK", name: "Czech Republic Koruna" },
        { code: "DJF", name: "Djiboutian Franc" },
        { code: "DKK", name: "Danish Krone" },
        { code: "DOP", name: "Dominican Peso" },
        { code: "DZD", name: "Algerian Dinar" },
        { code: "EGP", name: "Egyptian Pound" },
        { code: "ERN", name: "Eritrean Nakfa" },
        { code: "ETB", name: "Ethiopian Birr" },
        { code: "FJD", name: "Fijian Dollar" },
        { code: "FKP", name: "Falkland Islands Pound" },
        { code: "GEL", name: "Georgian Lari" },
        { code: "GGP", name: "Guernsey Pound" },
        { code: "GHS", name: "Ghanaian Cedi" },
        { code: "GIP", name: "Gibraltar Pound" },
        { code: "GMD", name: "Gambian Dalasi" },
        { code: "GNF", name: "Guinean Franc" },
        { code: "GTQ", name: "Guatemalan Quetzal" },
        { code: "GYD", name: "Guyanaese Dollar" },
        { code: "HNL", name: "Honduran Lempira" },
        { code: "HRK", name: "Croatian Kuna" },
        { code: "HTG", name: "Haitian Gourde" },
        { code: "HUF", name: "Hungarian Forint" },
        { code: "IDR", name: "Indonesian Rupiah" },
        { code: "ILS", name: "Israeli New Sheqel" },
        { code: "IMP", name: "Manx pound" },
        { code: "IQD", name: "Iraqi Dinar" },
        { code: "IRR", name: "Iranian Rial" },
        { code: "ISK", name: "Icelandic Króna" },
        { code: "JEP", name: "Jersey Pound" },
        { code: "JMD", name: "Jamaican Dollar" },
        { code: "JOD", name: "Jordanian Dinar" },
        { code: "KES", name: "Kenyan Shilling" },
        { code: "KGS", name: "Kyrgystani Som" },
        { code: "KHR", name: "Cambodian Riel" },
        { code: "KMF", name: "Comorian Franc" },
        { code: "KPW", name: "North Korean Won" },
        { code: "KWD", name: "Kuwaiti Dinar" },
        { code: "KYD", name: "Cayman Islands Dollar" },
        { code: "KZT", name: "Kazakhstani Tenge" },
        { code: "LAK", name: "Laotian Kip" },
        { code: "LBP", name: "Lebanese Pound" },
        { code: "LKR", name: "Sri Lankan Rupee" },
        { code: "LRD", name: "Liberian Dollar" },
        { code: "LSL", name: "Lesotho Loti" },
        { code: "LYD", name: "Libyan Dinar" },
        { code: "MAD", name: "Moroccan Dirham" },
        { code: "MDL", name: "Moldovan Leu" },
        { code: "MGA", name: "Malagasy Ariary" },
        { code: "MKD", name: "Macedonian Denar" },
        { code: "MMK", name: "Myanma Kyat" },
        { code: "MNT", name: "Mongolian Tugrik" },
        { code: "MOP", name: "Macanese Pataca" },
        { code: "MRU", name: "Mauritanian Ouguiya" },
        { code: "MUR", name: "Mauritian Rupee" },
        { code: "MVR", name: "Maldivian Rufiyaa" },
        { code: "MWK", name: "Malawian Kwacha" },
        { code: "MYR", name: "Malaysian Ringgit" },
        { code: "MZN", name: "Mozambican Metical" },
        { code: "NAD", name: "Namibian Dollar" },
        { code: "NGN", name: "Nigerian Naira" },
        { code: "NIO", name: "Nicaraguan Córdoba" },
        { code: "NPR", name: "Nepalese Rupee" },
        { code: "OMR", name: "Omani Rial" },
        { code: "PAB", name: "Panamanian Balboa" },
        { code: "PEN", name: "Peruvian Nuevo Sol" },
        { code: "PGK", name: "Papua New Guinean Kina" },
        { code: "PHP", name: "Philippine Peso" },
        { code: "PKR", name: "Pakistani Rupee" },
        { code: "PLN", name: "Polish Zloty" },
        { code: "PYG", name: "Paraguayan Guarani" },
        { code: "QAR", name: "Qatari Rial" },
        { code: "RON", name: "Romanian Leu" },
        { code: "RSD", name: "Serbian Dinar" },
        { code: "RWF", name: "Rwandan Franc" },
        { code: "SAR", name: "Saudi Riyal" },
        { code: "SBD", name: "Solomon Islands Dollar" },
        { code: "SCR", name: "Seychellois Rupee" },
        { code: "SDG", name: "Sudanese Pound" },
        { code: "SHP", name: "Saint Helena Pound" },
        { code: "SLL", name: "Sierra Leonean Leone" },
        { code: "SOS", name: "Somali Shilling" },
        { code: "SRD", name: "Surinamese Dollar" },
        { code: "SSP", name: "South Sudanese Pound" },
        { code: "STN", name: "São Tomé and Príncipe Dobra" },
        { code: "SYP", name: "Syrian Pound" },
        { code: "SZL", name: "Swazi Lilangeni" },
        { code: "THB", name: "Thai Baht" },
        { code: "TJS", name: "Tajikistani Somoni" },
        { code: "TMT", name: "Turkmenistani Manat" },
        { code: "TND", name: "Tunisian Dinar" },
        { code: "TOP", name: "Tongan Paʻanga" },
        { code: "TTD", name: "Trinidad and Tobago Dollar" },
        { code: "TWD", name: "New Taiwan Dollar" },
        { code: "TZS", name: "Tanzanian Shilling" },
        { code: "UAH", name: "Ukrainian Hryvnia" },
        { code: "UGX", name: "Ugandan Shilling" },
        { code: "UYU", name: "Uruguayan Peso" },
        { code: "UZS", name: "Uzbekistan Som" },
        { code: "VES", name: "Venezuelan Bolívar" },
        { code: "VND", name: "Vietnamese Dong" },
        { code: "VUV", name: "Vanuatu Vatu" },
        { code: "WST", name: "Samoan Tala" },
        { code: "XAF", name: "CFA Franc BEAC" },
        { code: "XCD", name: "East Caribbean Dollar" },
        { code: "XDR", name: "Special Drawing Rights" },
        { code: "XOF", name: "CFA Franc BCEAO" },
        { code: "XPF", name: "CFP Franc" },
        { code: "YER", name: "Yemeni Rial" },
        { code: "ZMW", name: "Zambian Kwacha" },
        { code: "ZWL", name: "Zimbabwean Dollar" }
    ];

    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPricing, setEditingPricing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        specialization: '',
        serviceType: 'consultation',
        basePrice: '',
        discountPercentage: '',
        discountedPrice: '',
        isDiscounted: false,
        currency: 'USD',
        description: '',
        duration: '',
        isActive: true
    });

    const pricingPerPage = 10;

    useEffect(() => {
        fetchPricing();
    }, [currentPage]);

    useEffect(() => {
        // Calculate discounted price when base price or discount percentage changes
        if (formData.isDiscounted && formData.basePrice && formData.discountPercentage) {
            const base = parseFloat(formData.basePrice);
            const discount = parseFloat(formData.discountPercentage);
            const discounted = base - (base * discount / 100);
            setFormData(prev => ({
                ...prev,
                discountedPrice: discounted.toFixed(2)
            }));
        } else if (!formData.isDiscounted) {
            setFormData(prev => ({
                ...prev,
                discountedPrice: '',
                discountPercentage: ''
            }));
        }
    }, [formData.basePrice, formData.discountPercentage, formData.isDiscounted]);

    const fetchPricing = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`/api/pricing/all?page=${currentPage}&limit=${pricingPerPage}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setPricing(response.data.pricing || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching pricing:', error);
            toast.error('Failed to fetch pricing. Please try again later.');
            setPricing([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                serviceName: formData.specialization, // Backward compatibility
                discountPercentage: formData.isDiscounted ? formData.discountPercentage : 0
            };

            if (editingPricing) {
                await axios.put(`/api/pricing/${editingPricing._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Pricing updated successfully');
            } else {
                await axios.post('/api/pricing', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Pricing added successfully');
            }
            setShowModal(false);
            await fetchPricing();
            resetForm();
        } catch (error) {
            console.error('Error saving pricing:', error);
            toast.error(error.response?.data?.message || 'Failed to save pricing');
        }
    };

    const handleEdit = (pricingItem) => {
        setEditingPricing(pricingItem);
        setFormData({
            specialization: pricingItem.serviceName, // Map serviceName to specialization
            serviceType: pricingItem.serviceType,
            basePrice: pricingItem.basePrice,
            discountPercentage: pricingItem.isDiscounted ? pricingItem.discountPercentage : '',
            discountedPrice: pricingItem.discountedPrice || '',
            isDiscounted: pricingItem.isDiscounted,
            currency: pricingItem.currency,
            description: pricingItem.description || '',
            duration: pricingItem.duration || '',
            isActive: pricingItem.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pricing entry?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`/api/pricing/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Pricing deleted successfully');
                
                if (pricing.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    await fetchPricing();
                }
            } catch (error) {
                console.error('Error deleting pricing:', error);
                toast.error('Failed to delete pricing. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            specialization: '',
            serviceType: 'consultation',
            basePrice: '',
            discountPercentage: '',
            discountedPrice: '',
            isDiscounted: false,
            currency: 'USD',
            description: '',
            duration: '',
            isActive: true
        });
        setEditingPricing(null);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pricing Management</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                >
                    <FaPlus className="mr-2" />
                    Add Pricing
                </button>
            </div>

            {/* Pricing Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pricing.length > 0 ? (
                            pricing.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.serviceName}</div>
                                                <div className="text-sm text-gray-500">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{item.serviceType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.isDiscounted ? (
                                                <div>
                                                    <div className="line-through text-gray-500">
                                                        {item.currency} {item.basePrice}
                                                    </div>
                                                    <div>
                                                        {item.currency} {item.discountedPrice} ({item.discountPercentage}% off)
                                                    </div>
                                                </div>
                                            ) : (
                                                `${item.currency} ${item.basePrice}`
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.duration} min</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            aria-label="Edit pricing"
                                        >
                                            <FaEdit className="inline-block" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:text-red-900"
                                            aria-label="Delete pricing"
                                        >
                                            <FaTrash className="inline-block" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No pricing entries found. Click "Add Pricing" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            {/* Add/Edit Pricing Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center pt-16 z-50">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingPricing ? 'Edit Pricing' : 'Add New Pricing'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Specialization*</label>
                                    <select
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select a specialization</option>
                                        {specialtiesList.map((specialty) => (
                                            <option key={specialty} value={specialty}>{specialty}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Type*</label>
                                    <select
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="consultation">Consultation</option>
                                        <option value="treatment">Treatment</option>
                                        <option value="test">Test</option>
                                        <option value="surgery">Surgery</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base Price*</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            value={formData.basePrice}
                                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="0.00"
                                            required
                                            step="0.01"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDiscounted}
                                        onChange={(e) => setFormData({ ...formData, isDiscounted: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Enable Discount</label>
                                </div>
                                {formData.isDiscounted && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                value={formData.discountPercentage}
                                                onChange={(e) => {
                                                    const value = Math.min(100, Math.max(0, e.target.value));
                                                    setFormData({ ...formData, discountPercentage: value });
                                                }}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                                                min="0"
                                                max="100"
                                                step="1"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">%</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Discounted Price: {formData.currency} {formData.discountedPrice || '0.00'}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Currency*</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {currencies.map((currency) => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.name} ({currency.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {editingPricing ? 'Update Pricing' : 'Add Pricing'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPricing;