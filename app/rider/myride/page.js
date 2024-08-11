"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { FaSearch, FaChevronDown, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Importing useRouter
import { capitalize } from "../../data/utils"; // Assuming you have a capitalize utility function

const rideColumns = [
  { name: "PICKUP LOCATION", uid: "pickupLocation" },
  { name: "DROPOFF LOCATION", uid: "dropoffLocation" },
  { name: "DISTANCE (km)", uid: "distanceTraveled" },
  { name: "START TIME", uid: "startTime", sortable: true },
  { name: "END TIME", uid: "endTime" },
  { name: "TYPE", uid: "rideType" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = {
  available: {
    label: 'Available',
    color: 'green',
  },
  booked: {
    label: 'Booked',
    color: 'yellow',
  },
  'in transit': {
    label: 'In Transit',
    color: 'blue',
  },
  delivered: {
    label: 'Delivered',
    color: 'purple',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
  },
};

const INITIAL_VISIBLE_COLUMNS = ["pickupLocation", "dropoffLocation", "distanceTraveled", "startTime", "endTime", "rideType", "status", "actions"];

export default function RidesTable() {
  const [rides, setRides] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "startTime",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const { isLoaded, isSignedIn, user } = useUser();
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/users/myprofile");
        if (response.data.success) {
          setUserId(response.data.user._id);
        } else {
          console.error("Failed to fetch user profile:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("/api/rides");
        if (response.data.success) {
          setRides(response.data.rides);
        } else {
          console.error("Failed to fetch rides:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      }
    };

    fetchRides();
  }, []);

  // Function to handle the delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/rides/${id}`);
      if (response.data.success) {
        setRides(rides.filter((ride) => ride._id !== id));
      } else {
        console.error("Failed to delete ride:", response.data);
      }
    } catch (error) {
      console.error("Failed to delete ride:", error);
    }
  };

  // Function to handle the view action
  const handleView = (id) => {
    router.push(`/rider/${id}`);
  };

  // Function to handle the edit action
  const handleEdit = (id) => {
    router.push(`/rider/edit/${id}`);
  };

  const filteredRides = useMemo(() => {
    return rides.filter(
      (ride) =>
        ride.user === userId &&
        (ride.pickupLocation.toLowerCase().includes(filterValue.toLowerCase()) ||
          ride.dropoffLocation.toLowerCase().includes(filterValue.toLowerCase())) &&
        (statusFilter.size === 0 || statusFilter.has(ride.status))
    );
  }, [rides, filterValue, userId, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRides.slice(start, end);
  }, [page, filteredRides, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((ride, columnKey) => {
    const cellValue = ride[columnKey];
    switch (columnKey) {
      case "pickupLocation":
      case "dropoffLocation":
      case "distanceTraveled":
      case "startTime":
      case "endTime":
      case "rideType":
        return <span>{cellValue}</span>;
      case "status":
        const statusInfo = statusOptions[cellValue] || {};
        return (
          <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>
            {statusInfo.label}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <FaEllipsisV className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleView(ride._id)}>View</DropdownItem>
                <DropdownItem onClick={() => handleEdit(ride._id)}>Edit</DropdownItem>
                <DropdownItem onClick={() => handleDelete(ride._id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [handleDelete, handleView, handleEdit]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{ base: "w-full sm:max-w-[44%]", inputWrapper: "border-1" }}
            placeholder="Search by location..."
            size="sm"
            startContent={<FaSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Ride Status"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => setStatusFilter(new Set(keys))}
              >
                {Object.keys(statusOptions).map((key) => (
                  <DropdownItem key={key} className="capitalize">
                    {capitalize(statusOptions[key].label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<FaChevronDown className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Columns"
                closeOnSelect={false}
                disallowEmptySelection
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {rideColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns]);

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between">
      <Pagination
        showControls
        isCompact
        page={page}
        total={Math.ceil(filteredRides.length / rowsPerPage)}
        onChange={setPage}
        size="sm"
      />
      <div className="w-[100px]">
        <Input
          isClearable={false}
          label="Rows per page"
          labelPlacement="outside"
          type="number"
          value={rowsPerPage}
          size="sm"
          onValueChange={(value) => setRowsPerPage(Number(value))}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {topContent}
      <Table
        aria-label="Rides Table"
        bottomContent={bottomContent}
        sortDescriptor={sortDescriptor}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        isHeaderSticky
        isMultiSort
      >
        <TableHeader columns={rideColumns.filter((column) => visibleColumns.has(column.uid))}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting={column.sortable}
              className="capitalize"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No rides available"} items={sortedItems}>
          {(ride) => (
            <TableRow key={ride._id}>
              {(columnKey) => (
                <TableCell>{renderCell(ride, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
