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
  FaBicycle,
  FaTags,
  FaClock,
  FaInfoCircle,
} from "react-icons/fa";

export default function RideDetail() {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get the ride ID from the URL

  useEffect(() => {
    const fetchRideDetail = async () => {
      try {
        const { data } = await axios.get(`/api/rides/${id}`);
        console.log(data.ride);
        if (data.success) {
          setRide(data.ride);
        } else {
          console.error("Failed to fetch ride detail:", data);
        }
      } catch (error) {
        console.error("Failed to fetch ride detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetail();
  }, [id]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <Skeleton className="w-full h-[90vh] rounded-md" />
      </Card>
    );
  }

  if (!ride) {
    return <div className="text-center">No ride details available</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <h1 className="text-xl font-bold mb-2">🚴‍♂️ Ride Detail</h1>
        <p className="text-sm text-default-500 text-center">
          ℹ️ Learn more about the ride and its specifics below.
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center">
          <h4 className="font-bold text-center">{ride.name} 🚴</h4>
          <p className="text-sm text-default-500 text-center">
            🏷️ {ride.rideType}
          </p>
        </div>
        <p className="text-lg font-medium text-center mb-4">📋 Details</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            
            <span>🆔 Ride ID: {ride.user._id}</span>
          </div>
          <div className="flex items-center gap-2">
      
            <span>🎁 Donation: {ride.donation?.donationName}</span>
          </div>
          <div className="flex items-center gap-2">
          
            <span>📍 Pick Up: {ride.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-2">
           
            <span>📍 Drop: {ride.dropoffLocation}</span>
          </div>
          <div className="flex items-center gap-2">
         
            <span>🛣️ Distance: {ride.distanceTraveled}</span>
          </div>
          <div className="flex items-center gap-2">
           
            <span>📊 Status: {ride.status}</span>
          </div>
          <div className="flex items-center gap-2">
           
            <span>📝 Notes: {ride.notes}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
