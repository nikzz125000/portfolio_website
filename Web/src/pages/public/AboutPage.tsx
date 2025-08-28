// import { Container, } from '@mui/material';
// import FullScreen3DViewer from '../3D_Loader/3D_Loader';

// const AboutPage = () => {
//   return (
//     <Container maxWidth="lg">
// <FullScreen3DViewer/>
//     </Container>
//   );
// };

// export default AboutPage;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DynamicClickableImage: React.FC = () => {
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageUrl(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <input type="file" accept="image/*" onChange={handleUpload} />
//       {imageUrl && (
//         <div className="relative mt-4">
//           <img src={imageUrl} alt="Uploaded" className="w-full h-auto rounded" />

//           {/* Top third */}
//           <div
//             onClick={() => navigate("/abc/1")}
//             className="absolute top-0 left-0 w-full h-1/3 cursor-pointer"
//           />

//           {/* Middle third */}
//           <div
//             onClick={() => navigate("/abc/2")}
//             className="absolute top-1/3 left-0 w-full h-1/3 cursor-pointer"
//           />

//           {/* Bottom third */}
//           <div
//             onClick={() => navigate("/abc/3")}
//             className="absolute bottom-0 left-0 w-full h-1/3 cursor-pointer"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DynamicClickableImage;



const AboutPage = () => {
  return (
    <div>AboutPage</div>
  )
}

export default AboutPage
