// import styled from 'styled-components'
// const ProductDiv = styled.div`
//         background: linear-gradient(to bottom, #D5DCEA, #FAFAFA); /* Adjust colors as needed */
//         background-repeat: no-repeat;
//         background-position: center center;
//         transform: skewY(-10deg);
//         margin-top:16px;
//         margin-bottom:16px;
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: auto;
//         background-color: red;
// `
export const ProductCard = () => {
    return (
        <div className="w-40 h-60 border flex-col justify-center items-center inline-flex">
            <div className="relative w-full h-full">
                <div className="absolute left-8 top-28 w-28 h-1">
                    <div className="absolute w-12 h-1 left-0 top-0 bg-black bg-opacity-10 rounded-full blur-[4.57px]" />
                    <div className="absolute w-12 h-1 left-16 top-0 bg-black bg-opacity-10 rounded-full blur-[4.57px]" />
                </div>
                <div className="absolute left-4 top-36 w-28 h-16 flex-col justify-start items-start inline-flex">
                    <div className="text-black text-opacity-60 text-sm font-medium font-Poppins">Road Bike</div>
                    <div className="text-black text-sm font-bold font-Poppins">PEUGEOT - LR01</div>
                    <div className="text-black text-opacity-60 text-sm font-medium font-Poppins">$1,999.99</div>
                </div>
                <img className="absolute w-32 h-20 left-1/2 -translate-x-1/2 top-3" src={'productBg'} alt="Product Image" />
            </div>
        </div>

    )
}
