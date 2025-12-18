/**

 * 서버 전용 상품 데이터

 * API Routes에서만 사용됩니다.

 */

import { mealMenuProducts } from "../../../src/domain/meal/dummyData";



const baseServerProducts = [

  {

    id: "product-1",

    name: "초기",

    description: "초기 식단 정기배송 상품",

    kind: "식단",

    mealStageId: "초기",

    periodOptions: [

      { period: "1주", price: 50000 },

      { period: "2주", price: 95000 },

      { period: "4주", price: 180000 },

    ],

    createdAt: "2024-01-15T00:00:00.000Z",

  },

  {

    id: "product-2",

    name: "중기",

    description: "중기 식단 정기배송 상품",

    kind: "식단",

    mealStageId: "중기",

    periodOptions: [

      { period: "1주", price: 65940 },

      { period: "2주", price: 120080 },

      { period: "4주", price: 244720 },

    ],

    createdAt: "2024-01-01T00:00:00.000Z",

  },

];



// meal 단품(Product)들을 API 응답용 서버 데이터 형태로 변환

const mealSingleProducts = mealMenuProducts.map((product) => ({

  id: product.id,

  name: product.name,

  description: product.description,

  kind: product.kind,

  mealStageId: product.mealStageId,

  periodOptions: product.periodOptions,

  createdAt: product.createdAt.toISOString(),

}));



export const serverProducts = [...baseServerProducts, ...mealSingleProducts];



