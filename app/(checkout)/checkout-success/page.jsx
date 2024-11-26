import { Play } from 'lucide-react';
import { admin, adminDB } from '../../../lib/firebase_admin';
import React from 'react';

const getPayment = async ({ checkout_id }) => {
  // We have uid/payment/checkoutId
  // If we want to access entire payment group with checkoutId instead of uid which we donot have in this scenario, then we use collectionGroup 
  const res = await adminDB
    .collectionGroup('payments')
    .where('metadata.checkoutId', '==', checkout_id)
    .where('status', '==', 'succeeded')
    .get()

  if (res.empty) {
    throw new Error('Payment with checkout not found!')
  }

  return res.docs[0].data()
};

const processOrder = async ({ uid, courseId, payment }) => {
  const subscription = await adminDB
    .doc(`users/${uid}/subscriptions/${courseId}`)
    .get()

  if (subscription.exists) {
    // The user is already subscribed, return null
    return null
  } else {
    // Create
    await adminDB
      .doc(`users/${uid}/subscriptions/${courseId}`)
      .set({
        id: courseId,
        courseId: courseId,
        timestamp: admin.firestore.Timestamp.now(),
        uid: uid,
        payment: payment
      })

    // Increment
    await adminDB.doc(`courses/${courseId}`).update({
      totalStudents: admin.firestore.FieldValue.increment(1)
    })
  }
}

const SuccessPage = async ({ searchParams }) => {
  const { checkout_id } = await searchParams;

  // Fetch payment by checkout_id
  const payment = await getPayment({ checkout_id: checkout_id });
  const { uid, courseId } = payment?.metadata

  await processOrder({
    courseId: courseId,
    payment: payment,
    uid: uid,
  })

  return (
    <div className='p-8 py-20 flex flex-col w-full gap-3 justify-center items-center'>
      <h1 className='text-3xl capitalize font-semibold'>
        Payment is successful!
      </h1>
      <button className='flex  gap-1 items-center bg-indigo-700 rounded-lg text-white px-5 py-2 text-sm font-semibold'>
        <Play size={14} /> Learn
      </button>
    </div>
  );
};

export default SuccessPage;
