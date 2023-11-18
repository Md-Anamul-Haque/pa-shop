
export const UserCard = () => {
    return (
        <div className="bg-white rounded-md overflow-hidden shadow-md w-48">
            <img className="w-full h-24 object-cover object-center" src="handler_image.jpg" alt="Business Handler" />
            <div className="p-4">
                <div className="font-bold text-lg mb-2">Jane Smith</div>
                <p className="text-gray-700 text-sm">
                    Email: jane.smith@email.com
                </p>
                <p className="text-gray-700 text-sm">
                    Role: Business Handler
                </p>
            </div>
        </div>


    )
}
