// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function loader({ params }: any) {
//     console.log(params);
//     return { contact: '' };

import { useParams } from "react-router-dom";

// }
const Product = () => {
    const { prod_id } = useParams();
    console.log({ prod_id })
    return (
        <div>Product  :{prod_id}</div>
    )
}

export default Product