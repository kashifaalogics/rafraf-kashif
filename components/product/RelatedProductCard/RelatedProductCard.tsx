import { Product } from "@common/types/product";
import { FunctionComponent, useCallback, useEffect } from "react";
import { Image } from "@components/ui";
import { NeImage, Loading } from "@components/ui";
import { Link } from "@components/ui";
import { A, Caption1, H5, Label, Subtitle } from "@components/typography";
import useLangDirection from "@utils/language/useLangDirection";
import { Button } from "@components/ui";
import { AddToCart, Heart } from "@components/icons";
import useTranslation from "next-translate/useTranslation";
import { IMAGES_STORAGE_URL } from "@framework/const";
import manuImg from "../../../assets/data/manufacturersImages.json";

import { Rating } from "@components/ui";
import { useCartItems, useViewport, useSearchEngine } from "@common/hooks";
import { useRouter } from "next/router";
import { RootState } from "@common/store";
import { useSelector } from "react-redux";
import { getProduct, getSingleProduct } from "@framework/product";
import { getConfig } from "@framework/api/config";
import NextImage from "next/image";
import { useState } from "react";
import { useStore } from "@common/state";
import { getSource } from "framework/analytics";
import { recordAPI } from "framework/analytics";

interface Props {
  product: Product;
  variant?: "gird" | "flat";
  onWishListed?: (p: Product) => void;
  onBuyNow?: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
  wishlistingProduct?: boolean;
}

const ProductCardGrid: FunctionComponent<Props> = ({
  product,
  onAddToCart = () => {},
  onBuyNow = () => {},
  onWishListed = () => {},
  wishlistingProduct = false,
}) => {
  const { rtl } = useLangDirection();
  const { t } = useTranslation();
  const { breakpoint: bp } = useViewport();
  const [singleClick, setSingleClick] = useState(0);
  const setToggleCartCall = useStore((state) => state.setToggleCartCall);
  const categories = useSelector(
    (rootState: RootState) =>
      rootState.productListing.variables.filter?.category_id?.in
  );
  const router = useRouter();
  // async function getProduct() {
  //     try {
  //         const apiConfig = getConfig({ locale: "ar" });
  //         const res = await fetch(`https://api.rafraf.com/graphql`, {
  //         method: "POST",
  //         body: JSON.stringify({ query: `
  //         query {
  //           products(filter: { sku: { eq: "${product.sku}" } }) {
  //             total_count
  //             items {
  //               id
  //               name
  //               sku
  //               url_key
  //               stock_status
  //               new_from_date
  //               new_to_date
  //               special_price
  //               special_from_date
  //               special_to_date
  //               __typename
  //               short_description {
  //                 html
  //               }
  //               description {
  //                 html
  //               }
  //               sale
  //               new
  //               attribute_set_id
  //               meta_title
  //               meta_keyword
  //               meta_description
  //               manufacturer
  //               country_of_manufacture
  //               gift_message_available
  //               image {
  //                 url
  //                 label
  //               }
  //               small_image {
  //                 url
  //                 label
  //               }
  //               thumbnail {
  //                 url
  //                 label
  //               }
  //               swatch_image
  //               media_gallery {
  //                 url
  //                 label
  //               }
  //               price_range {
  //                 minimum_price {
  //                   regular_price {
  //                     value
  //                     currency
  //                   }
  //                   final_price {
  //                     value
  //                     currency
  //                   }
  //                 }
  //                 maximum_price {
  //                   regular_price {
  //                     value
  //                     currency
  //                   }
  //                   final_price {
  //                     value
  //                     currency
  //                   }
  //                 }
  //               }
  //               price_tiers {
  //                 quantity
  //                 final_price {
  //                   value
  //                   currency
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       `,
  //       locale: apiConfig.locale,
  //       token: apiConfig.token
  //     }),

  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await res.json();
  //       return data;
  //       // product.variants[0].attributes[0].uid = data.data.products.items[0].variants[0].attributes[0].uid

  //     }
  //     catch(e) {
  //       console.log('ERROR 500')
  //       console.log(e)
  //     }
  //  }
  //  let that: any = this
  //  const product1: any = getProduct().then((data) =>
  //  {
  //   product = data.data.products.items[0];

  //  });

  //  console.log("Product", product);

  return (
    <Link
      prefetch={false}
      rel="canonical"
      href={`/parts/${categories?.length ? categories[0] : "all"}/product/${
        product.slug ? product.slug : "product.slug"
      }`}
    >
      <A
        className="hover:no-underline"
        title={product.name}
        onClick={(e) => {
          if (singleClick !== e.timeStamp) {
            // recordAPI({behaviour: "on_product", source: getSource({router: router.asPath}), product: product.sku})
          }
          //
        }}
      >
        <div
          dir={rtl ? "rtl" : "ltr"}
          className="rounded-md p-2 md:pt-11 md:pb-4 md:px-6 bg-white hover:bg-green-100 transition-all h-full relative"
          style={{
            minHeight: bp === "sm" ? "244px" : "370px",
            ...(bp === "sm" ? { minWidth: "150px" } : {}),
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* genuine */}
          <div
            className="absolute top-0 left-0 cursor-pointer text-center items-center pt-auto z-20"
            style={{
              background:
                product.stock_status !== "IN_STOCK"
                  ? "#E74949"
                  : product.type === "genuine"
                  ? "#FFCE03"
                  : "#DDEBEB",
              color: product.stock_status !== "IN_STOCK" ? "white" : "black",
              borderRadius: "6px 0px",
              width: `${bp === "sm" ? "54px" : "103px"}`,
              height: `${bp === "sm" ? "26px" : "32px"}`,
              fontSize: `${bp === "sm" ? "12px" : "15px"}`,
              paddingTop: "5px",
            }}
          >
            {product.stock_status !== "IN_STOCK"
              ? t("product:outOfStock")
              : product.type === "genuine"
              ? t("common/cart:genuine")
              : t("common/cart:aftermarket")}
          </div>

          {/* <div
            className="absolute top-0 right-0 cursor-pointer z-20"
            title="wishlist"
            onClick={(e) => {
              e.preventDefault();
              if (wishlistingProduct) return;
              onWishListed(product);
            }}
          >

            {wishlistingProduct ? (
              <Loading className="m-3 p-1" />
            ) : (
              // <Heart className="transition-all hover:bg-blue-op-30 rounded-md m-3 p-1" />
            )}
          </div> */}
          <div className="flex justify-center">
            <div
              className="relative z-0"
              style={
                bp === "sm"
                  ? { width: "100px", height: "100px" }
                  : { width: "186px", height: "148px" }
              }
            >
              <NeImage
                src={encodeURI(product.images[0].url)}
                layout="fill"
                objectFit="scale-down"
                loading="lazy"
                blurDataURL={encodeURI(product.images[0].url)}
                placeholder="blur"
              />
            </div>
          </div>
          <Subtitle className="pt-1 md:pt-2 leading-5 my-2 overflow-ellipsis h-12 overflow-hidden z-20 ">
            {product.name ? product.name : product.name}
          </Subtitle>
          <div className="flex items-baseline my-1 md:my-2">
            <H5>
              {product?.price?.final?.currencyCode || ""}{" "}
              {product?.price?.final?.value?.toFixed(2) || ""}
            </H5>
            <span className="text-darkgrey line-through mx-2 text-xs leading-5">
              {product.price.regular?.currencyCode || ""}{" "}
              {product.price.regular?.value?.toFixed(2) || ""}
            </span>
          </div>
          {product.manufacturer ? (
            <>
              <div className="col-span-2 productCardVendorLogo">
                <img
                  src={
                    IMAGES_STORAGE_URL +
                    manuImg[product.manufacturer as keyof typeof manuImg]
                  }
                  className="h-6"
                  alt="Logo Image"
                />
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2 productCardVendorLogo"></div>
            </>
          )}

          {/* <div className="flex mx-1 md:mx-2 items-baseline">
            <Rating rating={product?.rating?.summary || 0} />
            <Caption1 className="text-darkgrey text-sm mx-2">
              {bp === "sm" ? "" : t("product/card:review")} (
              {product.reviews?.count || 0})
            </Caption1>
          </div> */}

          <div className="flex justify-between mt-2 md:mt-4 gap-2 ">
            <Button
              id="buy-now-cardz"
              color="blue"
              className="buy-now-cardz h-9 flex-1"
              style={{
                fontSize: bp === "sm" ? "15px" : "18px",
                backgroundColor: "rgb(41, 171, 135)",
              }}
              disabled={product.stock_status === "IN_STOCK" ? false : true}
              onClickCapture={async (e) => {
                // e.preventDefault();
                setSingleClick(e.timeStamp);
                // recordAPI({ behaviour: "buy_now", source: getSource({router: router.asPath}), product: product.sku });
                if (
                  product.variants[0].attributes[0].label ===
                  "vendor_from_search"
                ) {
                  const apiConfig = getConfig({ locale: "ar" });
                  const TestProductPromise = await (async () => {
                    try {
                      const res = await fetch(
                        `https://api.rafraf.com/graphql`,
                        {
                          method: "POST",
                          body: JSON.stringify({
                            query: `
                        query {
                          products(search: "${product.sku}") {
                            items {
                            ... on ConfigurableProduct {
                              variants {
                                attributes {
                                  code
                                  uid
                                  value_index
                                  label
                                }
                              }
                            }

                            }
                          }
                        }
                      `,
                            locale: apiConfig.locale,
                            token: apiConfig.token,
                          }),

                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      const data = await res.json();
                      product.variants[0].attributes[0].uid =
                        data.data.products.items[0].variants[0].attributes[0].uid;
                    } catch (e) {
                      console.log("ERROR 500");
                      console.log(e);
                    }
                  })();
                }
                onBuyNow(product);
              }}
              title={t("common/cart:addingToCart")}
            >
              {/* {t("product/card:buyNow")} */}
              {t("common/cart:buyNow")}
            </Button>
            <Button
              id="add-to-cart-cardz"
              color="white"
              disabled={product.stock_status === "IN_STOCK" ? false : true}
              className={`add-to-cart-cardz md:flex items-center justify-center shadow-none border-2 ${
                product.stock_status === "IN_STOCK" ? "border-primary" : ""
              } hover:bg-blue-op-20 active:bg-blue-op-30 h-9 w-12`}
              onClickCapture={async (e) => {
                console.log("debug 10");
                e.preventDefault();
                setSingleClick(e.timeStamp);
                // recordAPI({ behaviour: "add_to_cart", source: getSource({router: router.asPath}), product: product.sku });
                if (
                  product.variants[0].attributes[0].label ===
                  "vendor_from_search"
                ) {
                  const apiConfig = getConfig({ locale: "ar" });
                  const TestProductPromise = await (async () => {
                    try {
                      const res = await fetch(
                        `https://api.rafraf.com/graphql`,
                        {
                          method: "POST",
                          body: JSON.stringify({
                            query: `
                        query {
                          products(search: "${product.sku}") {
                            items {
                            ... on ConfigurableProduct {
                              variants {
                                attributes {
                                  code
                                  uid
                                  value_index
                                  label
                                }
                              }
                            }

                            }
                          }
                        }
                      `,
                            locale: apiConfig.locale,
                            token: apiConfig.token,
                          }),

                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );

                      const data = await res.json();
                      setToggleCartCall();
                      product.variants[0].attributes[0].uid =
                        data.data.products.items[0].variants[0].attributes[0].uid;
                      console.log("data3", data);
                    } catch (e) {
                      console.log("ERROR 500");
                      console.log(e);

                      try {
                      } catch (e) {
                        console.log("ERROR 500");
                        console.log(e);

                        return {};
                      }
                    }
                  })();
                }

                onAddToCart(product);
              }}
              title={t("product:addToCart")}
            >
              <AddToCart />
            </Button>
          </div>
        </div>
      </A>
    </Link>
  );
};

const ProductCardFlat: FunctionComponent<Props> = ({
  product,
  onAddToCart = () => {},
  onBuyNow = () => {},
  onWishListed = () => {},
}) => {
  const { rtl } = useLangDirection();
  const { t } = useTranslation();
  const { breakpoint: bp } = useViewport();
  const categories = useSelector(
    (rootState: RootState) =>
      rootState.productListing.variables.filter?.category_id?.in
  );

  return (
    <Link
      prefetch={false}
      rel="canonical"
      href={`/parts/${categories?.length ? categories[0] : "all"}/product/${
        product.slug
      }`}
    >
      <A className="hover:no-underline" title={product.name}>
        <div
          dir={rtl ? "rtl" : "ltr"}
          className="rounded-md bg-white hover:bg-green-100 transition-all h-full flex justify-center items-center flex-wrap"
          style={{
            height: bp === "sm" ? "auto" : "120px",
            width: bp === "sm" ? "100%" : "458px",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="flex justify-center">
            <div className="relative" style={{ width: "98px", height: "78px" }}>
              <NeImage
                src={encodeURI(product.images[0].url)}
                layout="fill"
                objectFit="scale-down"
                loading="lazy"
                blurDataURL={encodeURI(product.images[0].url)}
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Subtitle className="leading-5 overflow-ellipsis overflow-hidden h-12 w-40 flex items-center">
              {product.name}
            </Subtitle>
            <div className="flex items-baseline my-2">
              <H5>
                {product.price.final?.currencyCode || ""}{" "}
                {product.price.final?.value?.toFixed(2) || ""}
              </H5>
              <span className="text-darkgrey line-through mx-2 text-xs leading-5">
                {product.price.regular?.currencyCode || ""}
                {""}
                {product.price.regular?.value?.toFixed(2) || ""}
              </span>
            </div>
          </div>

          <div
            className={`${
              bp === "sm" ? "w-full" : "flex-1"
            } flex justify-between p-4 gap-2 h-full items-end`}
          >
            <Button
              color="blue"
              className="h-9 flex-1 w-full"
              onClick={(e) => {
                e.preventDefault();
                onBuyNow(product);
              }}
            >
              {/* {t("product/card:buyNow")} */}
              {t("common/cart:buyNow")}
            </Button>
            <Button
              color="white"
              className="shadow-none border-2 border-primary hover:bg-blue-op-20 active:bg-blue-op-30 h-9 w-12"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
            >
              <AddToCart />
            </Button>
          </div>
        </div>
      </A>
    </Link>
  );
};

const RelatedProductCard: FunctionComponent<Props> = ({
  variant,
  onAddToCart,
  onBuyNow,
  ...props
}) => {
  const { addToCart } = useCartItems();
  const router = useRouter();

  const handleAddToCart = useCallback(
    (p: Product) => {
      if (!onAddToCart) {
        addToCart({ product: p });
      } else {
        onAddToCart(p);
      }
    },
    [addToCart, onAddToCart]
  );

  const handleBuyNow = useCallback(
    (p: Product) => {
      if (!onBuyNow) {
        addToCart({ product: p }).then(() => router.push("/checkout"));
      } else {
        onBuyNow(p);
      }
    },
    [addToCart, onBuyNow]
  );

  if (variant === "gird") {
    return (
      <ProductCardGrid
        {...props}
        variant="gird"
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    );
  } else if (variant === "flat") {
    return (
      <ProductCardFlat
        {...props}
        variant="flat"
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    );
  } else {
    return (
      <ProductCardGrid
        {...props}
        variant="gird"
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    );
  }
};

export default RelatedProductCard;
