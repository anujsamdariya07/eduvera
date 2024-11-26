import React from 'react'
import { db } from '../firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

export const createCheckoutSessionAndGetURL = async ({ uid, course }) => {
  if (!uid) {
    throw new Error('Please Log In First...')
  }

  if (!course?.id) {
    throw new Error('Course Not Found...')
  }

  // Creating a unique id for every checkout
  const checkoutId = doc(collection(db, 'courses')).id;

  // For creating checkout session we want data 
  let data = {
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: course?.title,
            description: course?.shortDescription,
            images: [course?.imageURL],
            metadata: {
              courseId: course?.id,
            },
          },
          unit_amount: course?.salePrice * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      checkoutId: checkoutId,
      courseId: course?.id,
      uid: uid,
    },
    success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-success?checkout_id=${checkoutId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/checkout-failed?checkout_id=${checkoutId}`,
  };

  const docRef = doc(db, `users/${uid}/checkout_sessions/${checkoutId}`)

  // Saving the checkout data in the docRef route
  await setDoc(docRef, data)

  // Firebase extension will set a url for this given data
  // We will wait for 5-6 seconds before accessing it
  await new Promise((res) => setTimeout(res, 6000))

  // Accessing the checkout url
  const checkout = await getDoc(docRef)

  if (checkout.exists() && checkout?.data()?.url) {
    // return checkout?.data
    // return checkout?.data
    return checkout
  } else {
    // Firebase function was late in generating url
    await new Promise((res) => setTimeout(res, 6000))
    
    // Accessing the checkout url
    const checkout = await getDoc(docRef)
    
    if (checkout.exists() && checkout?.data()?.url) {
      // console.log('checkout?.data: ', checkout?.data)
      // return checkout?.data
      return checkout
    } else {
      // Firebase function was late in generating url --> error
      throw new Error('Something went wrong! Please try again later!')
    }
  }
}