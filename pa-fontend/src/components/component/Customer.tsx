
export const CustomerCard = () => {
    return (
        <div className="bg-white rounded-md overflow-hidden shadow-md w-48">
            <img className="w-full h-24 object-cover object-center" src="customer_image.jpg" alt="Customer" />
            <div className="p-4">
                <div className="font-bold text-lg mb-2">John Doe</div>
                <p className="text-gray-700 text-sm">
                    Email: john.doe@email.com
                </p>
                <p className="text-gray-700 text-sm">
                    Phone: +1 (555) 123-4567
                </p>
            </div>
        </div>
    )
}
