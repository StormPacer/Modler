const protocol = require("protocol-registry")

protocol.register(
    {
        protocol: "modler",
        command: `${process.cwd()}\\modler.exe $_URL_`,
        override: true,
        terminal: true
    }
)