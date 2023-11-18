
export const SupplierCard = () => {
    return (
        <div className="bg-white rounded-md overflow-hidden shadow-md w-48 inline-block">
            <img className="w-full h-24 object-cover object-center" src="supplier_image.jpg" alt="Supplier" />
            <div className="p-4">
                <div className="font-bold text-lg mb-2">ABC Suppliers</div>
                <p className="text-gray-700 text-sm">
                    Location: City, Country
                </p>
                <p className="text-gray-700 text-sm">
                    Contact: contact@abc-suppliers.com
                </p>
            </div>
            <div className="p-4">
                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">#Quality</span>
                <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">#Reliable</span>
            </div>
        </div>

    )
}
