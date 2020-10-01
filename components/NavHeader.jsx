import humanize from 'underscore.string/humanize';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from 'mdi-material-ui/Home';
import AboutIcon from 'mdi-material-ui/Information';
import LogIcon from 'mdi-material-ui/CheckCircle';
import PrivacyIcon from 'mdi-material-ui/Eye';
import ExportIcon from 'mdi-material-ui/FileDownload';
import ChevronRightIcon from 'mdi-material-ui/ChevronRight';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Link from './Link';
import { StorageContext } from './Storage';
import CategoryIcon from './CategoryIcon';

const CategoryItem = ({ category }) => (
    <ListItem button key={category} component={Link} href="/[category]" as={`/${category}`}>
        <ListItemIcon>
            <CategoryIcon category={category} />
        </ListItemIcon>
        <ListItemText primary={humanize(category)} />
    </ListItem>
);

export default function NavHeader({ title, href, as }) {
    const [drawerIsOpen, openDrawer] = useState(false);

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" onClick={() => openDrawer(true)}>
                        <StorageContext.Consumer>
                            {([storage]) => (
                                <Badge
                                    color="error"
                                    badgeContent={
                                        (storage &&
                                            storage.pageData &&
                                            storage.pageData.updates &&
                                            1) ||
                                        null
                                    }
                                >
                                    <MenuIcon />
                                </Badge>
                            )}
                        </StorageContext.Consumer>
                    </IconButton>
                    <Box ml={1}>
                        <Link
                            href="/index"
                            as="/"
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                lineHeight: '20px',
                                fontWeight: 500,
                            }}
                        >
                            {title && (
                                <>
                                    <Hidden smDown>{process.env.APP_NAME}</Hidden>
                                    <Hidden mdUp>{process.env.APP_SHORT_NAME}</Hidden>
                                </>
                            )}
                            {!title && process.env.APP_NAME}
                        </Link>
                    </Box>
                    {title && (
                        <>
                            <Box ml={0.5} mt="3px">
                                <ChevronRightIcon />
                            </Box>
                            <Box ml={0.5}>
                                <Link
                                    href={href}
                                    as={as}
                                    style={{
                                        color: 'white',
                                        fontSize: '20px',
                                        lineHeight: '20px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {title}
                                </Link>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Toolbar variant="dense" />
            <Drawer anchor="left" open={drawerIsOpen} onClose={() => openDrawer(false)}>
                <div
                    role="presentation"
                    onClick={() => openDrawer(false)}
                    onKeyDown={() => openDrawer(false)}
                    style={{ width: '250px' }}
                >
                    <List component="nav">
                        <ListItem button component={Link} href="/index" as="/">
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <Divider />
                        <CategoryItem category="parks" />
                        <CategoryItem category="attractions" />
                        <CategoryItem category="routes" />
                        <CategoryItem category="campsites" />
                        <Divider />
                        <ListItem button component={Link} href="/log" as="/log">
                            <ListItemIcon>
                                <LogIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log" />
                        </ListItem>
                        <ListItem button component={Link} href="/export" as="/export">
                            <ListItemIcon>
                                <StorageContext.Consumer>
                                    {([storage]) => (
                                        <Badge
                                            color="error"
                                            badgeContent={
                                                (storage &&
                                                    storage.pageData &&
                                                    storage.pageData.updates &&
                                                    1) ||
                                                null
                                            }
                                        >
                                            <ExportIcon />
                                        </Badge>
                                    )}
                                </StorageContext.Consumer>
                            </ListItemIcon>
                            <ListItemText primary="Export" />
                        </ListItem>
                        <Divider />
                        <ListItem button component={Link} href="/about" as="/about">
                            <ListItemIcon>
                                <AboutIcon />
                            </ListItemIcon>
                            <ListItemText primary="About" />
                        </ListItem>
                        <ListItem button component={Link} href="/privacy" as="/privacy">
                            <ListItemIcon>
                                <PrivacyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Privacy" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
}
