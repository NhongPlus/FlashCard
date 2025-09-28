// import { useEffect, useState } from "react";
// import axios from 'axios';
// function useFetch(url: string) {
//     const [data, setData] = useState([])
//     const [error, setError] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             let isMounted = true;
//             setLoading(true);
//             try {
//                 if (isMounted) {
//                     const response = await axios.get(url);
//                     setData(response.data);
//                     setError(false)
//                 }
//             } catch (error) {
//                 if (isMounted) {
//                     setError(true);
//                     setLoading(false);
//                 }
//             }
//             return () => {
//                 isMounted = false;
//             }
//         };
//         fetchData();
//     }, [url])
//     return { data, error, loading }
// }

// export default useFetch;