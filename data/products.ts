import type { Product } from "@/types/product"

// Original data
const originalProducts: Product[] = [
  {
    Product_URL: "https://www.ajio.com/netplay-checked-polo-t-shirt/p/441137362_white",
    Brand: "netplay",
    Description: "Checked Polo T-shirt",
    Id_Product: "441137362",
    URL_image:
      "https://assets.ajio.com/medias/sys_master/root/20220309/inTn/6227b81faeb26921afcde577/-286Wx359H-441137362-white-MODEL.jpg",
    Category_by_gender: "Men",
    "Discount Price (in Rs.)": 559,
    "Product Price": 699,
    Color: "white",
  },
  {
    Product_URL: "https://www.ajio.com/netplay-tapered-fit-flat-front-trousers/p/441124497_navy",
    Brand: "netplay",
    Description: "Tapered Fit Flat-Front Trousers",
    Id_Product: "441124497",
    URL_image:
      "https://assets.ajio.com/medias/sys_master/root/20210907/vQKt/6136775cf997ddce89bddeea/-286Wx359H-441124497-navy-MODEL.jpg",
    Category_by_gender: "Men",
    "Discount Price (in Rs.)": 720,
    "Product Price": 1499,
    Color: "navy",
  },
  {
    Product_URL: "https://www.ajio.com/the-indian-garage-co-striped-slim-fit-shirt-with-patch-pocket/p/460453612_white",
    Brand: "the-indian-garage-co",
    Description: "Striped Slim Fit Shirt with Patch Pocket",
    Id_Product: "460453612",
    URL_image:
      "https://assets.ajio.com/medias/sys_master/root/20211228/s1km/61ca36a4aeb26901101f7552/-286Wx359H-460453612-white-MODEL.jpg",
    Category_by_gender: "Men",
    "Discount Price (in Rs.)": 495,
    "Product Price": 1649,
    Color: "white",
  },
  {
    Product_URL: "https://www.ajio.com/performax-heathered-crew-neck-t-shirt/p/441036730_charcoal",
    Brand: "performax",
    Description: "Heathered Crew-Neck T-shirt",
    Id_Product: "441036730",
    URL_image:
      "https://assets.ajio.com/medias/sys_master/root/20220120/lLur/61e981aef997dd66232f4792/-286Wx359H-441036730-charcoal-MODEL.jpg",
    Category_by_gender: "Men",
    "Discount Price (in Rs.)": 329,
    "Product Price": 599,
    Color: "charcoal",
  },
  {
    Product_URL: "https://www.ajio.com/john-players-jeans-washed-skinny-fit-jeans-with-whiskers/p/441128531_jetblack",
    Brand: "john-players-jeans",
    Description: "Washed Skinny Fit Jeans with Whiskers",
    Id_Product: "441128531",
    URL_image:
      "https://assets.ajio.com/medias/sys_master/root/20210728/I1Im/61005afff997ddb3123c0416/-286Wx359H-441128531-jetblack-MODEL.jpg",
    Category_by_gender: "Men",
    "Discount Price (in Rs.)": 899,
    "Product Price": 999,
    Color: "jetblack",
  },
]

// Function to create variations of products
function createProductVariations(products: Product[], count: number): Product[] {
  const variations: Product[] = []

  for (let i = 0; i < count; i++) {
    const baseProduct = products[i % products.length]
    const variation: Product = {
      ...baseProduct,
      Id_Product: `${baseProduct.Id_Product}_var${Math.floor(i / products.length) + 1}`,
      Description:
        i % 3 === 0
          ? `Premium ${baseProduct.Description}`
          : i % 3 === 1
            ? `${baseProduct.Description} - Limited Edition`
            : `${baseProduct.Description} - New Arrival`,
      "Discount Price (in Rs.)": Math.round(baseProduct["Discount Price (in Rs.)"] * (0.9 + Math.random() * 0.2)),
      "Product Price": Math.round(baseProduct["Product Price"] * (0.9 + Math.random() * 0.2)),
    }
    variations.push(variation)
  }

  return variations
}

// Create 30 product variations (for pagination demo)
export const products: Product[] = [...originalProducts, ...createProductVariations(originalProducts, 25)]
