"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Skeleton,
} from "@nextui-org/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUtensils,
  FaTags,
  FaThermometerHalf,
  FaBox,
  FaInfoCircle,
} from "react-icons/fa";

export default function DonationDetail() {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get the donation ID from the URL

  useEffect(() => {
    const fetchDonationDetail = async () => {
      try {
        const { data } = await axios.get(`/api/donations/${id}`);
        console.log(data.donation);
        if (data.success) {
          setDonation(data.donation);
        } else {
          console.error("Failed to fetch donation detail:", data);
        }
      } catch (error) {
        console.error("Failed to fetch donation detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationDetail();
  }, [id]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <Skeleton className="w-full h-[90vh] rounded-md" />
      </Card>
    );
  }

  if (!donation) {
    return <div className="text-center">No donation details available</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <h1 className="text-xl font-bold mb-2">Donation Detail</h1>
        <p className="text-sm text-default-500 text-center">
          Learn more about the donation and its specifics below.
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center">
          <Image
            src={donation.image}
            alt={donation.donationName}
            className="rounded-full w-24 h-24 mb-4"
          />
          <h4 className="font-bold text-center">{donation.donationName}</h4>
          <p className="text-sm text-default-500 text-center">{donation.category}</p>
        </div>
        <p className="text-lg font-medium text-center mb-4">Details</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-default-400" />
            <span>
              Prepared: {new Date(donation.preparedTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-default-400" />
            <span>
              Expiry: {new Date(donation.expiryDateTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-default-400" />
            <span>{donation.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStickyNote className="text-default-400" />
            <span>{donation.specialNote}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-default-400" />
            <span>Status: {donation.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaThermometerHalf className="text-default-400" />
            <span>Type: {donation.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBox className="text-default-400" />
            <span>Quantity: {donation.quantity}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
