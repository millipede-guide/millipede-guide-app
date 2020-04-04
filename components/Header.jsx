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
import ParksIcon from 'mdi-material-ui/ImageFilterHdr';
import CampsitesIcon from 'mdi-material-ui/Tent';
import RoutesIcon from 'mdi-material-ui/Walk';
import AttractionsIcon from 'mdi-material-ui/Binoculars';
import AboutIcon from 'mdi-material-ui/Information';
import FileDownloadIcon from 'mdi-material-ui/FileDownload';
import MuiLink from './Link';

export default () => {
    const [drawerIsOpen, openDrawer] = useState(false);

    const icons = {
        parks: ParksIcon,
        campsites: CampsitesIcon,
        routes: RoutesIcon,
        attractions: AttractionsIcon,
    };

    const icon = item => {
        const Icon = icons[item];
        return <Icon />;
    };

    const listItem = item => (
        <NextLink key={item} href={`/${item}/all`}>
            <ListItem button>
                <ListItemIcon>{icon(item)}</ListItemIcon>
                <ListItemText primary={humanize(item)} />
            </ListItem>
        </NextLink>
    );

    return (
        <>
            <AppBar position="fixed">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" onClick={() => openDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <MuiLink href="/" variant="h6" style={{ color: 'white' }}>
                        <Box ml={1}>Millipede Guide</Box>
                    </MuiLink>
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
                        {Object.keys(icons).map(listItem)}
                        <Divider />
                        <NextLink href="/about">
                            <ListItem button>
                                <ListItemIcon>
                                    <AboutIcon />
                                </ListItemIcon>
                                <ListItemText primary="About" />
                            </ListItem>
                        </NextLink>
                        <NextLink href="/export">
                            <ListItem button>
                                <ListItemIcon>
                                    <FileDownloadIcon />
                                </ListItemIcon>
                                <ListItemText primary="Export / Backup" />
                            </ListItem>
                        </NextLink>
                    </List>
                </div>
            </Drawer>
        </>
    );
};
