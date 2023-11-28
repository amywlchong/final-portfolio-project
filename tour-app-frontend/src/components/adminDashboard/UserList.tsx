import { Avatar, Box, Card, CardHeader, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import personImg from "../../assets/images/person.png";
import useScreenSize from "../../hooks/ui/useScreenSize";
import { Role, User } from "../../types";
import { ApiError } from "../../utils/ApiError";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: ApiError | null;
}

const UserList = ({ users, isLoading, error }: UserListProps) => {
  const { isSmallAndUp } = useScreenSize();

  const fiveNewestCustomers = [...users]
    .filter(user => user.role === Role.Customer && user.signupDate !== undefined)
    .sort((a, b) => new Date(b.signupDate as string).getTime() - new Date(a.signupDate as string).getTime())
    .slice(0, 5);

  let userCardContent;
  if (isLoading) {
    userCardContent = <div>Loading...</div>;
  } else if (error) {
    userCardContent = <div>Error fetching data</div>;
  } else if (fiveNewestCustomers.length > 0) {
    userCardContent = (
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {fiveNewestCustomers.map(customer => (
          <Box key={customer.id}>
            <ListItem
              alignItems="center"
              secondaryAction={
                <IconButton onClick={() => window.open(`mailto:${customer.email}`)}>
                  <MailOutlineIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar alt="person" src={personImg} />
              </ListItemAvatar>
              <ListItemText
                primary={customer.name}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Box>
        ))}
      </List>
    );
  } else {
    userCardContent = <div>No customers found.</div>;
  }

  return (
    <Card style={{ width: isSmallAndUp ? "34%" : "100%", marginTop: isSmallAndUp ? 0 : "20px" }}>
      <CardHeader
        title="New Customers"
      />
      {userCardContent}
    </Card>
  );
};

export default UserList;
