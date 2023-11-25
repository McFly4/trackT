// import {useMatches, Link} from '@remix-run/react';
// import {z} from 'zod';

// export const breadcrumbTypeSchema = z.enum([
//   'collections',
//   'collection',
//   'product',
// ]);
// export type TBreadcrumbType = z.infer<typeof breadcrumbTypeSchema>;

// export default function Breadcrumb() {
//   const matches = useMatches();
//   const deepestRoute = matches.at(-1) as any;
//   const parsedBreadcrumbType = breadcrumbTypeSchema.safeParse(
//     deepestRoute?.handle,
//   );

//   const isvalideBreadcrumbType = parsedBreadcrumbType.success;

//   console.log(deepestRoute);
//   if (isvalideBreadcrumbType) {
//     switch (parsedBreadcrumbType.data) {
//       case 'collections':
//       case 'collection':
//         pages.push({
//           href: '/collections',
//           name: 'Collections',
//         });

//         pages.push({
//           href: `/collections/${deepestRoute?.data?.collection?.handle}`,
//           name: `${deepestRoute?.data?.collection?.title}`,
//         });
//         break;

//       case 'product':
//         pages.push({
//           href: '/collections',
//           name: 'Collections',
//         });

//         const collection =
//           deepestRoute?.data?.product?.collections?.nodes?.at(0);

//         pages.push({
//           href: `/collections/${collection?.handle}`,
//           name: `${collection?.title}`,
//         });

//         pages.push({
//           href: `${deepestRoute?.data?.product?.pathname}`,
//           name: `${deepestRoute?.data?.product?.title}`,
//         });
//         break;
//       default:
//         break;
//     }
//   } else {
//     return null;
//   }

//   console.log(pages);

//   return (
//     <div>
//       <nav className="breadcrumb" aria-label="Breadcrumb">
//         <ol>
//           {pages.map((page, index) => {
//             return (
//               <li key={index}>
//                 <Link to={page.href}>{page.name}</Link>
//               </li>
//             );
//           })}
//         </ol>
//       </nav>
//     </div>
//   );
// }
