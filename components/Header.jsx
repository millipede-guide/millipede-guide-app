import humanize from 'underscore.string/humanize';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import React, { useState } from 'react';
import NextLink from 'next/link';
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
import MuiLink from './Link';
import { StorageContext } from './Storage';
import CategoryIcon from './CategoryIcon';

const CategoryItem = ({ category }) => (
    <NextLink key={category} href={`/${category}`}>
        <ListItem button>
            <ListItemIcon>
                <CategoryIcon category={category} />
            </ListItemIcon>
            <ListItemText primary={humanize(category)} />
        </ListItem>
    </NextLink>
);

export default ({ title, href }) => {
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
                        <MuiLink
                            href="/"
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                lineHeight: '20px',
                                fontWeight: 500,
                            }}
                        >
                            {title && (
                                <>
                                    <Hidden smDown>{process.env.appName}</Hidden>
                                    <Hidden mdUp>{process.env.appShortName}</Hidden>
                                </>
                            )}
                            {!title && process.env.appName}
                        </MuiLink>
                    </Box>
                    {title && (
                        <>
                            <Box ml={0.5} mt="3px">
                                <ChevronRightIcon />
                            </Box>
                            <Box ml={0.5}>
                                <MuiLink
                                    href={href}
                                    style={{
                                        color: 'white',
                                        fontSize: '20px',
                                        lineHeight: '20px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {title}
                                </MuiLink>
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
                        <NextLink href="/">
                            <ListItem button>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </NextLink>
                        <Divider />
                        <CategoryItem category="parks" />
                        <CategoryItem category="attractions" />
                        <CategoryItem category="routes" />
                        <CategoryItem category="campsites" />
                        <Divider />
                        <NextLink href="/log" as="/log">
                            <ListItem button>
                                <ListItemIcon>
                                    <LogIcon />
                                </ListItemIcon>
                                <ListItemText primary="Log" />
                            </ListItem>
                        </NextLink>
                        <NextLink href="/export" as="/export">
                            <ListItem button>
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
                        </NextLink>
                        <Divider />
                        <NextLink href="/about" as="/about">
                            <ListItem button>
                                <ListItemIcon>
                                    <AboutIcon />
                                </ListItemIcon>
                                <ListItemText primary="About" />
                            </ListItem>
                        </NextLink>
                        <NextLink href="/privacy" as="/privacy">
                            <ListItem button>
                                <ListItemIcon>
                                    <PrivacyIcon />
                                </ListItemIcon>
                                <ListItemText primary="Privacy" />
                            </ListItem>
                        </NextLink>
                    </List>
                </div>
            </Drawer>
        </>
    );
};
