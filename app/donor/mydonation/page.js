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

const donationColumns = [
  { name: "NAME", uid: "donationName", sortable: true },
  { name: "CATEGORY", uid: "category" },
  { name: "QUANTITY", uid: "quantity" },
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

const INITIAL_VISIBLE_COLUMNS = ["donationName", "category", "quantity", "status", "actions"];

export default function DonationsTable() {
  const [donations, setDonations] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState(new Set());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "donationName",
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
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/api/donations");
        if (response.data.success) {
          setDonations(response.data.donations);
        } else {
          console.error("Failed to fetch donations:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      }
    };

    fetchDonations();
  }, []);

  // Function to handle the delete action
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/donations/${id}`);
      if (response.data.success) {
        setDonations(donations.filter((donation) => donation._id !== id));
      } else {
        console.error("Failed to delete donation:", response.data);
      }
    } catch (error) {
      console.error("Failed to delete donation:", error);
    }
  };

  // Function to handle the view action
  const handleView = (id) => {
    router.push(`/donor/${id}`);
  };

  // Function to handle the edit action
  const handleEdit = (id) => {
    router.push(`/donor/edit/${id}`);
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(
      (donation) =>
        donation.donor === userId &&
        donation.donationName.toLowerCase().includes(filterValue.toLowerCase()) &&
        (statusFilter.size === 0 || statusFilter.has(donation.status))
    );
  }, [donations, filterValue, userId, statusFilter]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredDonations.slice(start, end);
  }, [page, filteredDonations, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((donation, columnKey) => {
    const cellValue = donation[columnKey];
    switch (columnKey) {
      case "donationName":
      case "category":
      case "quantity":
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
                <DropdownItem onClick={() => handleView(donation._id)}>View</DropdownItem>
                <DropdownItem onClick={() => handleEdit(donation._id)}>Edit</DropdownItem>
                <DropdownItem onClick={() => handleDelete(donation._id)}>Delete</DropdownItem>
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
            placeholder="Search by donation name..."
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
                aria-label="Donation Status"
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
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) => setVisibleColumns(new Set(keys))}
              >
                {donationColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredDonations.length} donations
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 font-bold"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <option className="bg-background" value={5}>
                5
              </option>
              <option className="bg-background" value={10}>
                10
              </option>
              <option className="bg-background" value={15}>
                15
              </option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, filteredDonations.length]);

  const bottomContent = (
    <Pagination
      isCompact
      showControls
      showShadow
      color="secondary"
      page={page}
      total={Math.ceil(filteredDonations.length / rowsPerPage)}
      initialPage={1}
      onChange={(page) => setPage(page)}
    />
  );

  return (
    <Table
      aria-label="My Donations Table"
      bordered
      lined
      headerLined
      sticked
      topContent={topContent}
      bottomContent={bottomContent}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      aria-labelledby="donationName"
    >
      <TableHeader columns={donationColumns.filter((column) => visibleColumns.has(column.uid))}>
        {(column) => (
          <TableColumn
            key={column.uid}
            allowsSorting={column.sortable}
            width={column.uid === "actions" ? "100px" : "auto"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
