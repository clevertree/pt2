import express from "express";
import {setup} from "../src/components/asset-browser/server/server.js";
import {config} from "dotenv";
import path from "path";
config();
// console.log(config({path: '.env'}))

const BUILD_PATH = path.resolve(process.cwd(), 'build');

const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        res.status(200);
        res.send("")
    } else {
        next()
    }
});


setup(app, BUILD_PATH);

app.listen(process.env.REACT_APP_SERVER_PORT, function() {
    console.log('Paradigm Threat Server listening on port: ' + process.env.REACT_APP_SERVER_PORT);
});
